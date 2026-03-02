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
  totalSteps = 7;
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
        this.addLanguage();
        this.addExperience();
        this.addEducation();
        this.addProject();
        this.addSkillCategory();
        this.addCertification();
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
      languages: this.fb.array([]),
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      projects: this.fb.array([]),
      skills: this.fb.array([]),
      certifications: this.fb.array([])
    });
  }

  loadPortfolio(slug: string) {
    this.isLoading.set(true);
    this.portfolioService.getPortfolio(slug).subscribe({
      next: (data) => {
        while (this.languages.length !== 0) this.languages.removeAt(0);
        while (this.experiences.length !== 0) this.experiences.removeAt(0);
        while (this.educations.length !== 0) this.educations.removeAt(0);
        while (this.projects.length !== 0) this.projects.removeAt(0);
        while (this.skills.length !== 0) this.skills.removeAt(0);
        while (this.certifications.length !== 0) this.certifications.removeAt(0);

        if (data.languages?.length) data.languages.forEach((l: string) => this.addLanguage(l));
        else this.addLanguage();

        if (data.experiences?.length) data.experiences.forEach((e: any) => this.addExperience(e));
        if (data.educations?.length) data.educations.forEach((e: any) => this.addEducation(e));
        if (data.projects?.length) data.projects.forEach((p: any) => this.addProject(p));
        if (data.skills?.length) data.skills.forEach((s: any) => this.addSkillCategory(s));
        if (data.certifications?.length) data.certifications.forEach((c: any) => this.addCertification(c));

        if (this.editSlug) {
            this.portfolioForm.get('slug')?.disable();
        }

        this.portfolioForm.patchValue({
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

  get languages() { return this.portfolioForm.get('languages') as FormArray; }
  get experiences() { return this.portfolioForm.get('experiences') as FormArray; }
  get educations() { return this.portfolioForm.get('educations') as FormArray; }
  get projects() { return this.portfolioForm.get('projects') as FormArray; }
  get skills() { return this.portfolioForm.get('skills') as FormArray; }
  get certifications() { return this.portfolioForm.get('certifications') as FormArray; }

  addLanguage(val = '') { this.languages.push(this.fb.control(val)); }
  removeLanguage(i: number) { this.languages.removeAt(i); }

  addExperience(data?: any) {
    const form = this.fb.group({
      role: [data?.role || '', Validators.required],
      company: [data?.company || '', Validators.required],
      period: [data?.period || '', Validators.required],
      location: [data?.location || ''],
      description: [data?.description || '', Validators.required],
      responsibilities: this.fb.array([]),
      projects: this.fb.array([]),
      recognition: this.fb.group({
        title: [data?.recognition?.title || ''],
        description: [data?.recognition?.description || ''],
        date: [data?.recognition?.date || '']
      })
    });
    const arr = form.get('responsibilities') as FormArray;
    if (data?.responsibilities?.length) data.responsibilities.forEach((i: string) => arr.push(this.fb.control(i)));
    else arr.push(this.fb.control(''));

    const projArr = form.get('projects') as FormArray;
    if (data?.projects?.length) {
      data.projects.forEach((p: any) => {
        const pForm = this.fb.group({
          name: [p.name || '', Validators.required],
          tech: [p.tech || '', Validators.required],
          points: this.fb.array([])
        });
        const pts = pForm.get('points') as FormArray;
        if (p.points?.length) p.points.forEach((pt: string) => pts.push(this.fb.control(pt)));
        else pts.push(this.fb.control(''));
        projArr.push(pForm);
      });
    }

    this.experiences.push(form);
  }
  
  addExpProject(expIndex: number) {
    const projArr = this.experiences.at(expIndex).get('projects') as FormArray;
    const pForm = this.fb.group({
      name: ['', Validators.required],
      tech: ['', Validators.required],
      points: this.fb.array([this.fb.control('')])
    });
    projArr.push(pForm);
  }
  removeExpProject(expIndex: number, projIndex: number) {
    (this.experiences.at(expIndex).get('projects') as FormArray).removeAt(projIndex);
  }
  addExpProjectPoint(expIndex: number, projIndex: number) {
    const projArr = this.experiences.at(expIndex).get('projects') as FormArray;
    (projArr.at(projIndex).get('points') as FormArray).push(this.fb.control(''));
  }
  removeExpProjectPoint(expIndex: number, projIndex: number, ptIndex: number) {
    const projArr = this.experiences.at(expIndex).get('projects') as FormArray;
    (projArr.at(projIndex).get('points') as FormArray).removeAt(ptIndex);
  }

  addExperienceResponsibility(expIndex: number) { (this.experiences.at(expIndex).get('responsibilities') as FormArray).push(this.fb.control('')); }
  removeExperienceResponsibility(expIndex: number, respIndex: number) { (this.experiences.at(expIndex).get('responsibilities') as FormArray).removeAt(respIndex); }
  removeExperience(index: number) { this.experiences.removeAt(index); }

  addEducation(data?: any) {
    this.educations.push(this.fb.group({
      degree: [data?.degree || '', Validators.required],
      institution: [data?.institution || '', Validators.required],
      period: [data?.period || '', Validators.required],
      description: [data?.description || '', Validators.required]
    }));
  }
  removeEducation(index: number) { this.educations.removeAt(index); }

  addProject(data?: any) {
    const form = this.fb.group({
      title: [data?.title || '', Validators.required],
      period: [data?.period || ''],
      role: [data?.role || ''],
      description: [data?.description || '', Validators.required],
      link: [data?.link || ''],
      imagePath: [data?.imagePath || ''],
      features: this.fb.array([]),
      techStack: this.fb.array([]),
      tags: this.fb.array([])
    });
    const pFeatures = form.get('features') as FormArray;
    if (data?.features?.length) data.features.forEach((i: string) => pFeatures.push(this.fb.control(i)));
    else pFeatures.push(this.fb.control(''));

    const pTech = form.get('techStack') as FormArray;
    if (data?.techStack?.length) data.techStack.forEach((i: string) => pTech.push(this.fb.control(i)));
    else pTech.push(this.fb.control(''));

    const pTags = form.get('tags') as FormArray;
    if (data?.tags?.length) data.tags.forEach((i: string) => pTags.push(this.fb.control(i)));
    else pTags.push(this.fb.control(''));

    this.projects.push(form);
  }
  addProjectFeature(pIndex: number) { (this.projects.at(pIndex).get('features') as FormArray).push(this.fb.control('')); }
  removeProjectFeature(pIndex: number, i: number) { (this.projects.at(pIndex).get('features') as FormArray).removeAt(i); }
  addProjectTech(pIndex: number) { (this.projects.at(pIndex).get('techStack') as FormArray).push(this.fb.control('')); }
  removeProjectTech(pIndex: number, i: number) { (this.projects.at(pIndex).get('techStack') as FormArray).removeAt(i); }
  addProjectTag(pIndex: number) { (this.projects.at(pIndex).get('tags') as FormArray).push(this.fb.control('')); }
  removeProjectTag(pIndex: number, i: number) { (this.projects.at(pIndex).get('tags') as FormArray).removeAt(i); }
  removeProject(index: number) { this.projects.removeAt(index); }

  addSkillCategory(data?: any) {
    const form = this.fb.group({
      category: [data?.category || '', Validators.required],
      items: this.fb.array([])
    });
    const items = form.get('items') as FormArray;
    if (data?.items?.length) data.items.forEach((i: string) => items.push(this.fb.control(i)));
    else items.push(this.fb.control(''));
    this.skills.push(form);
  }
  addSkillItem(sIndex: number) { (this.skills.at(sIndex).get('items') as FormArray).push(this.fb.control('')); }
  removeSkillItem(sIndex: number, i: number) { (this.skills.at(sIndex).get('items') as FormArray).removeAt(i); }
  removeSkillCategory(index: number) { this.skills.removeAt(index); }

  addCertification(data?: any) {
    this.certifications.push(this.fb.group({
      title: [data?.title || '', Validators.required],
      url: [data?.url || '', Validators.required]
    }));
  }
  removeCertification(index: number) { this.certifications.removeAt(index); }

  nextStep() { if (this.currentStep() < this.totalSteps) this.currentStep.update(s => s + 1); }
  prevStep() { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }

  onSubmit() {
    if (this.portfolioForm.invalid) {
      this.errorMessage.set('Please fill out all required fields marked with *');
      setTimeout(() => this.errorMessage.set(''), 5000);
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.saveSuccess.set(false);

    const raw = this.portfolioForm.getRawValue();
    const payload = JSON.parse(JSON.stringify(raw));

    payload.languages = payload.languages.filter((l: string) => l.trim() !== '');
    
    payload.experiences = payload.experiences.map((e: any) => {
      let rec = e.recognition;
      if (!rec.title && !rec.description && !rec.date) rec = null;
      
      return {
        ...e,
        responsibilities: e.responsibilities.filter((r: string) => r.trim() !== ''),
        projects: e.projects?.map((p: any) => ({
          ...p,
          points: p.points.filter((pt: string) => pt.trim() !== '')
        })) || [],
        recognition: rec
      };
    });
    
    payload.projects = payload.projects.map((p: any) => ({
      ...p,
      tags: p.tags.filter((t: string) => t.trim() !== ''),
      techStack: p.techStack.filter((t: string) => t.trim() !== ''),
      features: p.features.filter((f: string) => f.trim() !== ''),
      links: p.link ? [{ label: 'View Project', url: p.link }] : []
    }));

    payload.skills = payload.skills.map((s: any) => ({
      ...s,
      items: s.items.filter((i: string) => i.trim() !== '')
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
