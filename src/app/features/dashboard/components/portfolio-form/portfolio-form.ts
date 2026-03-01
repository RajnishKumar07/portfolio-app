import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../../../services/portfolio.service';

@Component({
  selector: 'app-portfolio-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './portfolio-form.html',
  styleUrl: './portfolio-form.scss'
})
export class PortfolioFormComponent implements OnInit {
  portfolioForm!: FormGroup;
  isSaving = signal(false);
  saveSuccess = signal(false);
  errorMessage = signal('');

  currentStep = signal(1);
  totalSteps = 6;
  editSlug: string | null = null;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    
    this.route.paramMap.subscribe(params => {
      this.editSlug = params.get('slug');
      if (this.editSlug) {
        this.loadPortfolio(this.editSlug);
      } else {
        // Add at least one empty item to each array by default so the UI isn't totally blank
        this.addExperience();
        this.addEducation();
        this.addProject();
        this.addSkillCategory();
      }
    });
  }

  initForm() {
    this.portfolioForm = this.fb.group({
      slug: ['', Validators.required],
      isPublic: [true],
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
        role: [''],
        tagline: [''],
        about: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        location: [''],
        githubUrl: [''],
        linkedinUrl: ['']
      }),
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      projects: this.fb.array([]),
      skills: this.fb.array([])
    });
  }

  loadPortfolio(slug: string) {
    this.isLoading.set(true);
    this.portfolioService.getPortfolio(slug).subscribe({
      next: (data) => {
        // Clear default arrays before patching
        while (this.experiences.length !== 0) this.experiences.removeAt(0);
        while (this.educations.length !== 0) this.educations.removeAt(0);
        while (this.projects.length !== 0) this.projects.removeAt(0);
        while (this.skills.length !== 0) this.skills.removeAt(0);

        // Prep arrays
        if (data.experiences) data.experiences.forEach(() => this.addExperience());
        if (data.educations) data.educations.forEach(() => this.addEducation());
        if (data.projects) {
          data.projects.forEach((p: any) => {
            p.tagsInput = p.tags ? p.tags.join(', ') : '';
            this.addProject();
          });
        }
        if (data.skills) {
          data.skills.forEach((s: any) => {
            s.itemsInput = s.items ? s.items.join(', ') : '';
            this.addSkillCategory();
          });
        }

        // Disable slug field in edit mode
        if (this.editSlug) {
            this.portfolioForm.get('slug')?.disable();
        }

        this.portfolioForm.patchValue(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load portfolio for editing.');
        this.isLoading.set(false);
      }
    });
  }

  // --- Getters for Form Arrays ---
  get experiences() { return this.portfolioForm.get('experiences') as FormArray; }
  get educations() { return this.portfolioForm.get('educations') as FormArray; }
  get projects() { return this.portfolioForm.get('projects') as FormArray; }
  get skills() { return this.portfolioForm.get('skills') as FormArray; }

  // --- Add Methods ---
  addExperience() {
    this.experiences.push(this.fb.group({
      role: ['', Validators.required],
      company: ['', Validators.required],
      period: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  addEducation() {
    this.educations.push(this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      period: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  addProject() {
    this.projects.push(this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      link: [''],
      imagePath: [''],
      tagsInput: ['', Validators.required]
    }));
  }

  addSkillCategory() {
    this.skills.push(this.fb.group({
      category: ['', Validators.required],
      itemsInput: ['', Validators.required] 
    }));
  }

  // --- Remove Methods ---
  removeExperience(index: number) { this.experiences.removeAt(index); }
  removeEducation(index: number) { this.educations.removeAt(index); }
  removeProject(index: number) { this.projects.removeAt(index); }
  removeSkillCategory(index: number) { this.skills.removeAt(index); }

  // --- Navigation & Submission ---
  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  onSubmit() {
    if (this.portfolioForm.invalid) {
      this.errorMessage.set('Please fill out all required fields marked with *');
      setTimeout(() => this.errorMessage.set(''), 5000);
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.saveSuccess.set(false);

    // Deep clone and use getRawValue to include disabled fields (like slug)
    const payload = JSON.parse(JSON.stringify(this.portfolioForm.getRawValue()));
    
    // Transform Project Tags
    payload.projects = payload.projects.map((p: any) => ({
      title: p.title,
      description: p.description,
      link: p.link,
      imagePath: p.imagePath,
      tags: p.tagsInput ? p.tagsInput.split(',').map((t: string) => t.trim()) : []
    }));

    // Transform Skill Items
    payload.skills = payload.skills.map((s: any) => ({
      category: s.category,
      items: s.itemsInput ? s.itemsInput.split(',').map((i: string) => i.trim()) : []
    }));

    const saveObs = this.editSlug 
        ? this.portfolioService.updatePortfolio(this.editSlug, payload)
        : this.portfolioService.createPortfolio(payload);

    saveObs.subscribe({
      next: (res) => {
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
}
