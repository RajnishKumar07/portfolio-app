import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.portfolioForm = this.fb.group({
      slug: ['', Validators.required],
      isPublic: [true],
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
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

    // Add at least one empty item to each array by default so the UI isn't totally blank
    this.addExperience();
    this.addEducation();
    this.addProject();
    this.addSkillCategory();
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
      // We will handle tags as a comma separated string in UI and split it before sending
      tagsInput: ['', Validators.required]
    }));
  }

  addSkillCategory() {
    this.skills.push(this.fb.group({
      category: ['', Validators.required],
      // Handled as a comma separated string
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
      // Briefly show error then fade out
      setTimeout(() => this.errorMessage.set(''), 5000);
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.saveSuccess.set(false);

    // Deep clone the form value to format the comma-separated strings into actual arrays as required by our NestJS DTOs
    const payload = JSON.parse(JSON.stringify(this.portfolioForm.value));
    
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

    this.portfolioService.createPortfolio(payload).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to save portfolio. Please try again.');
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }
}
