import { Component, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PortfolioService } from '../../../../services/portfolio.service';
import { firstValueFrom } from 'rxjs';
import { 
  PortfolioData, 
  Experience, 
  Education, 
  Project, 
  SkillItem, 
  Certification 
} from '../../../../core/models/portfolio.model';

import { PortfolioFormService } from '../../services/portfolio-form.service';

/**
 * Primary Controller for the Dashboard Portfolio Builder.
 * Exclusively handles UI Event Bindings, UI Submissions, and Drag-and-Drop native orchestration.
 * Form State and deep DB Hydration is abstracted to the `PortfolioFormService`.
 */
@Component({
  selector: 'app-portfolio-form',
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './portfolio-form.html',
  styleUrl: './portfolio-form.scss'
})
export class PortfolioFormComponent implements OnInit {
  isSaving = signal(false);
  saveSuccess = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  
  isUploadingImage = signal<number | null>(null);
  isUploadingResume = signal<boolean>(false);

  currentStep = signal(1);
  totalSteps = 7;
  editSlug: string | null = null;
  isLoading = signal(false);
  
  reorderModes = signal({
    experiences: false,
    educations: false,
    projects: false,
    skills: false,
    certifications: false
  });

  toggleReorderMode(section: keyof ReturnType<typeof this.reorderModes>) {
    this.reorderModes.update(m => ({ ...m, [section]: !m[section] }));
  }

  constructor(
    public formService: PortfolioFormService,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    if (!this.canDeactivate()) {
      $event.preventDefault();
      $event.returnValue = 'You have unsaved changes! Are you sure you want to leave?';
      return 'You have unsaved changes! Are you sure you want to leave?';
    }
    return true;
  }

  /** Prevents accidental navigation if the user has unsaved, dirty form data */
  canDeactivate(): boolean {
    return !(this.formService.form?.dirty && !this.saveSuccess());
  }

  ngOnInit() {
    this.formService.initForm();
    
    this.route.paramMap.subscribe(params => {
      this.editSlug = params.get('slug');
      if (this.editSlug) {
        this.loadPortfolio(this.editSlug);
      } else {
        // Add at least one empty item to each array by default so the UI isn't totally blank
        this.formService.addLanguage();
        this.formService.addExperience();
        this.formService.addEducation();
        this.formService.addProject();
        this.formService.addSkillCategory();
        this.formService.addCertification();
      }
    });
  }

  /**
   * Hydrates the reactive form with existing data when editing an active portfolio.
   * Flushes out empty default array elements before populating to prevent duplicates.
   * @param slug The unique portfolio identifier to fetch from the API.
   */
  loadPortfolio(slug: string) {
    this.isLoading.set(true);
    this.portfolioService.getPortfolio(slug).subscribe({
      next: (data) => {
        this.formService.clearAllArrays();
        this.formService.populateFormArrays(data);

        if (this.editSlug) {
            this.formService.form.get('slug')?.disable();
        }

        this.formService.form.patchValue({
            slug: data.slug,
            isPublic: data.isPublic,
            personalInfo: data.personalInfo
        });
        
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load portfolio for editing.');
        this.isLoading.set(false);
      }
    });
  }

  nextStep() { if (this.currentStep() < this.totalSteps) this.currentStep.update(s => s + 1); }
  prevStep() { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }

  /**
   * Primary Drag & Drop event handler for Angular CDK (`cdkDropList`).
   * Evaluates the scope and safely parses indices from strings versus active Forms before executing AbstractControl updates.
   */
  drop(event: CdkDragDrop<string[]>, section: string) {
    const array = this.formService.form.get(section) as FormArray;
    if (!array) return;
    this.processArrayDrop(array, event as unknown as CdkDragDrop<unknown[]>);
  }

  /**
   * Dedicated Drag handler for deeply nested arrays (e.g. Points natively inside an Experience).
   */
  dropNested(event: CdkDragDrop<unknown[]>, formArray: AbstractControl | null) {
    if (formArray instanceof FormArray) {
      this.processArrayDrop(formArray, event);
    }
  }

  private processArrayDrop(array: FormArray, event: CdkDragDrop<unknown[]>) {
    if (typeof array.value[0] === 'string') {
      const valueArray = [...array.value];
      moveItemInArray(valueArray, event.previousIndex, event.currentIndex);
      array.setValue(valueArray);
    } else {
      this.reorderFormGroupControls(array, event.previousIndex, event.currentIndex);
    }
    this.formService.form.markAsDirty();
  }

  private reorderFormGroupControls(array: FormArray, from: number, to: number) {
    const dir = to > from ? 1 : -1;
    const temp = array.at(from);
    for (let i = from; i * dir < to * dir; i += dir) {
      array.setControl(i, array.at(i + dir));
    }
    array.setControl(to, temp);
  }

  /* =========================================================
     RESUME & MEDIA UPLOAD HANDLERS
     ========================================================= */
  
  /**
   * Intercepts a `<input type="file">` event for a PDF, validates its size/type,
   * sends it to the Cloudinary Backend API, and patches the returned URL into the `resumeUrl` form control.
   */
  async uploadResume(event: Event) {
    const file = this.extractFileFromEvent(event);
    if (!this.isValidResumeUpload(file)) return;

    this.isUploadingResume.set(true);
    this.errorMessage.set(null);

    try {
      await this.processValidResumeUpload(file!);
    } catch (error: unknown) {
      this.handleResumeUploadError(error);
    } finally {
      this.finalizeResumeUpload(event);
    }
  }

  private extractFileFromEvent(e: Event): File | undefined {
      const input = e.target as HTMLInputElement;
      return input.files && input.files.length > 0 ? input.files[0] : undefined;
  }

  private async processValidResumeUpload(file: File) {
      const response = await firstValueFrom(this.portfolioService.uploadImage(file));
      this.patchResumeUrl(response?.url);
  }

  private patchResumeUrl(url?: string) {
      if (!url) return;
      const ctrl = this.formService.form.get('personalInfo.resumeUrl');
      if (ctrl) {
        ctrl.setValue(url);
        this.formService.form.markAsDirty();
      }
  }
  
  private handleResumeUploadError(e: unknown) {
      console.error('Resume upload error:', e);
      this.errorMessage.set('Failed to upload resume. Please try again.');
  }

  private finalizeResumeUpload(event: Event) {
      this.isUploadingResume.set(false);
      (event.target as HTMLInputElement).value = '';
  }

  private isValidResumeUpload(file: File | undefined): boolean {
    if (!file) return false;
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Only PDF files are supported for resumes.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      this.errorMessage.set('Resume file must be less than 10MB.');
      return false;
    }
    return true;
  }

  async removeResume() {
     this.formService.form.get('personalInfo.resumeUrl')?.setValue('');
     this.formService.form.markAsDirty();
  }

  /* =========================================================
     FORM OVERALL SUBMIT
     ========================================================= */

  /**
   * Final compilation step before saving to the DB.
   * Defers to the Service implementation to clean payloads, avoiding UI clutter.
   */
  onSubmit() {
    if (this.formService.form.invalid) {
      this.errorMessage.set('Please fill out all required fields marked with *');
      setTimeout(() => this.errorMessage.set(''), 5000);
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.saveSuccess.set(false);

    const payload = this.formService.getCleanPayload();

    const saveObs = this.editSlug 
        ? this.portfolioService.updatePortfolio(this.editSlug, payload)
        : this.portfolioService.createPortfolio(payload);

    saveObs.subscribe({
      next: (res: PortfolioData) => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
        if (!this.editSlug && res.slug) {
            this.router.navigate(['/dashboard/edit', res.slug]);
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to save portfolio. Please try again.');
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }

  uploadProjectImage(event: Event, projectIndex: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isUploadingImage.set(projectIndex);
    this.errorMessage.set('');

    this.portfolioService.uploadImage(file).subscribe({
      next: (res) => {
        const newUrl = res.url;
        this.formService.projects.at(projectIndex).patchValue({ imagePath: newUrl });
        
        this.isUploadingImage.set(null);
        this.formService.form.markAsDirty();
      },
      error: (err) => {
        this.errorMessage.set('Failed to upload image. Please try again.');
        this.isUploadingImage.set(null);
      }
    });
  }

  removeProjectImage(projectIndex: number) {
    const projectCtrl = this.formService.projects.at(projectIndex);
    const currentUrl = projectCtrl.get('imagePath')?.value;
    if (!currentUrl) return;

    projectCtrl.patchValue({ imagePath: '' });
    this.formService.form.markAsDirty();
  }
}
