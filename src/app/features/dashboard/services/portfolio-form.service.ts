import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Experience, Education, Project, SkillItem, Certification, PortfolioData } from '../../../core/models/portfolio.model';

/**
 * Enterprise State Management Service for the Builder Dashboard.
 * Extracted from ~400 lines of `portfolio-form.ts` UI code.
 * 
 * Responsibilities:
 * 1. Deeply Nested Reactive Form Initialization (`initForm`).
 * 2. Recursive Array Hydration (loading backend data).
 * 3. Array Dispatchers (`addExperience`, `addProjectFeature`).
 * 4. Payload Sanitization before Database saves.
 * 5. Native `AbstractControl` mutations (drag-and-drop orchestration).
 */
@Injectable({ providedIn: 'root' })
export class PortfolioFormService {
  public form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  /** Initializes the master Reactive Form mapping the DB Schema. */
  initForm(): FormGroup {
    this.form = this.fb.group({
      slug: ['', Validators.required],
      isPublic: [true],
      personalInfo: this.fb.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
        tagline: [''],
        isAvailableForWork: [true],
        about: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        location: [''],
        githubUrl: [''],
        linkedinUrl: [''],
        resumeUrl: ['']
      }),
      languages: this.fb.array([]),
      experiences: this.fb.array([]),
      educations: this.fb.array([]),
      projects: this.fb.array([]),
      skills: this.fb.array([]),
      certifications: this.fb.array([])
    });
    return this.form;
  }

  /* =========================================================
     COMPLEXITY HELPER UTILITIES
     ========================================================= */
  private str(val: unknown): string { return typeof val === 'string' ? val : val ? String(val) : ''; }
  private arr<T>(val: unknown): T[] { return Array.isArray(val) && val.length > 0 ? val as T[] : []; }

  /* =========================================================
     ARRAY ACCESSORS
     ========================================================= */
  get languages() { return this.form.get('languages') as FormArray; }
  get experiences() { return this.form.get('experiences') as FormArray; }
  get educations() { return this.form.get('educations') as FormArray; }
  get projects() { return this.form.get('projects') as FormArray; }
  get skills() { return this.form.get('skills') as FormArray; }
  get certifications() { return this.form.get('certifications') as FormArray; }

  /* =========================================================
     HYDRATION
     ========================================================= */
  clearAllArrays() {
    this.languages.clear();
    this.experiences.clear();
    this.educations.clear();
    this.projects.clear();
    this.skills.clear();
    this.certifications.clear();
  }

  populateFormArrays(data: Partial<PortfolioData>) {
    this.populateLanguages(data.languages);
    this.populateExperiences(data.experiences);
    this.populateEducations(data.educations);
    this.populateProjects(data.projects);
    this.populateSkills(data.skills);
    this.populateCertifications(data.certifications);
  }

  private populateLanguages(languages?: string[]) {
    if (!languages?.length) return;
    languages.forEach(l => this.addLanguage(l));
  }

  private populateExperiences(experiences?: Experience[]) {
    if (!experiences?.length) return;
    experiences.forEach(e => this.addExperience(e));
  }

  private populateEducations(educations?: Education[]) {
    if (!educations?.length) return;
    educations.forEach(e => this.addEducation(e));
  }

  private populateProjects(projects?: Project[]) {
    if (!projects?.length) return;
    projects.forEach(p => this.addProject(p));
  }

  private populateSkills(skills?: SkillItem[]) {
    if (!skills?.length) return;
    skills.forEach(s => this.addSkillCategory(s));
  }

  private populateCertifications(certifications?: Certification[]) {
    if (!certifications?.length) return;
    certifications.forEach(c => this.addCertification(c));
  }

  /* =========================================================
     FORM ARRAY ADDITION METHODS
     ========================================================= */
  addLanguage(val = '') { this.languages.push(this.fb.control(val)); }
  removeLanguage(i: number) { this.languages.removeAt(i); }

  addExperience(data?: Partial<Experience>) {
    const d = data || {};
    const formGrp = this.createExperienceGroup(d);
    
    this.hydrateExperienceResponsibilities(formGrp, d);
    this.hydrateExperienceProjects(formGrp, d);

    this.experiences.push(formGrp);
  }

  private createExperienceGroup(d: Partial<Experience>): FormGroup {
    const rec = d.recognition || ({} as Partial<NonNullable<Experience['recognition']>>);
    return this.fb.group({
      role: [this.str(d.role), Validators.required],
      company: [this.str(d.company), Validators.required],
      period: [this.str(d.period), Validators.required],
      location: [this.str(d.location)],
      description: [this.str(d.description), Validators.required],
      responsibilities: this.fb.array([]),
      projects: this.fb.array([]),
      recognition: this.fb.group({
        title: [this.str(rec.title)],
        description: [this.str(rec.description)],
        date: [this.str(rec.date)]
      })
    });
  }

  private hydrateExperienceResponsibilities(formGrp: FormGroup, d: Partial<Experience>) {
    const arr = formGrp.get('responsibilities') as FormArray;
    const items = this.arr<string>(d.responsibilities);
    if (items.length) {
      items.forEach((i: string) => arr.push(this.fb.control(this.str(i))));
    } else {
      arr.push(this.fb.control(''));
    }
  }

  private hydrateExperienceProjects(formGrp: FormGroup, d: Partial<Experience>) {
    const projArr = formGrp.get('projects') as FormArray;
    const projects = this.arr<NonNullable<Experience['projects']>[number]>(d.projects);
    if (projects.length) {
      projects.forEach((p) => this.pushNestedExperienceProject(projArr, p));
    }
  }

  private pushNestedExperienceProject(projArr: FormArray, p: NonNullable<Experience['projects']>[number]) {
    const pForm = this.fb.group({
      name: [this.str(p.name), Validators.required],
      tech: [this.str(p.tech), Validators.required],
      points: this.fb.array([])
    });
    
    const pts = pForm.get('points') as FormArray;
    const pointsData: string[] = this.arr(p.points);
    if (pointsData.length) {
      pointsData.forEach((pt: string) => pts.push(this.fb.control(this.str(pt))));
    } else {
      pts.push(this.fb.control(''));
    }
    projArr.push(pForm);
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
  removeExpProject(expIndex: number, projIndex: number) { (this.experiences.at(expIndex).get('projects') as FormArray).removeAt(projIndex); }
  addExpProjectPoint(expIndex: number, projIndex: number) { ((this.experiences.at(expIndex).get('projects') as FormArray).at(projIndex).get('points') as FormArray).push(this.fb.control('')); }
  removeExpProjectPoint(expIndex: number, projIndex: number, ptIndex: number) { ((this.experiences.at(expIndex).get('projects') as FormArray).at(projIndex).get('points') as FormArray).removeAt(ptIndex); }

  addExperienceResponsibility(expIndex: number) { (this.experiences.at(expIndex).get('responsibilities') as FormArray).push(this.fb.control('')); }
  removeExperienceResponsibility(expIndex: number, respIndex: number) { (this.experiences.at(expIndex).get('responsibilities') as FormArray).removeAt(respIndex); }
  removeExperience(index: number) { this.experiences.removeAt(index); }

  addEducation(data?: Partial<Education>) {
    const d = data || {};
    this.educations.push(this.fb.group({
      degree: [this.str(d.degree), Validators.required],
      institution: [this.str(d.institution), Validators.required],
      period: [this.str(d.period), Validators.required],
      description: [this.str(d.description), Validators.required]
    }));
  }
  removeEducation(index: number) { this.educations.removeAt(index); }

  private hydratePrimitiveArray(formGrp: FormGroup, controlName: string, items: string[]) {
    const arr = formGrp.get(controlName) as FormArray;
    if (items.length) {
      items.forEach((i: string) => arr.push(this.fb.control(this.str(i))));
    } else {
      arr.push(this.fb.control(''));
    }
  }

  addProject(data?: Partial<Project & { link?: string }>) {
    const d = data || {};
    const formGrp = this.fb.group({
      title: [this.str(d.title), Validators.required],
      period: [this.str(d.period)],
      role: [this.str(d.role)],
      description: [this.str(d.description), Validators.required],
      link: [this.str(d.links?.[0]?.url || d.link)],
      imagePath: [this.str(d.imagePath)],
      features: this.fb.array([]),
      techStack: this.fb.array([]),
      tags: this.fb.array([])
    });

    this.hydratePrimitiveArray(formGrp, 'features', this.arr(d.features));
    this.hydratePrimitiveArray(formGrp, 'techStack', this.arr(d.techStack));
    this.hydratePrimitiveArray(formGrp, 'tags', this.arr(d.tags));

    this.projects.push(formGrp);
  }
  addProjectFeature(pIndex: number) { (this.projects.at(pIndex).get('features') as FormArray).push(this.fb.control('')); }
  removeProjectFeature(pIndex: number, i: number) { (this.projects.at(pIndex).get('features') as FormArray).removeAt(i); }
  addProjectTech(pIndex: number) { (this.projects.at(pIndex).get('techStack') as FormArray).push(this.fb.control('')); }
  removeProjectTech(pIndex: number, i: number) { (this.projects.at(pIndex).get('techStack') as FormArray).removeAt(i); }
  addProjectTag(pIndex: number) { (this.projects.at(pIndex).get('tags') as FormArray).push(this.fb.control('')); }
  removeProjectTag(pIndex: number, i: number) { (this.projects.at(pIndex).get('tags') as FormArray).removeAt(i); }
  removeProject(index: number) { this.projects.removeAt(index); }

  addSkillCategory(data?: Partial<SkillItem>) {
    const d = data || {};
    const formGrp = this.fb.group({
      category: [this.str(d.category), Validators.required],
      items: this.fb.array([])
    });
    this.hydratePrimitiveArray(formGrp, 'items', this.arr(d.items));
    this.skills.push(formGrp);
  }
  addSkillItem(sIndex: number) { (this.skills.at(sIndex).get('items') as FormArray).push(this.fb.control('')); }
  removeSkillItem(sIndex: number, i: number) { (this.skills.at(sIndex).get('items') as FormArray).removeAt(i); }
  removeSkillCategory(index: number) { this.skills.removeAt(index); }

  addCertification(data?: Partial<Certification>) {
    const d = data || {};
    this.certifications.push(this.fb.group({
      title: [this.str(d.title), Validators.required],
      url: [this.str(d.url), Validators.required]
    }));
  }
  removeCertification(index: number) { this.certifications.removeAt(index); }

  /* =========================================================
     PAYLOAD SANITIZATION
     ========================================================= */

  getCleanPayload(): PortfolioData {
    const raw = this.form.getRawValue();
    const payload = JSON.parse(JSON.stringify(raw)) as PortfolioData;

    payload.languages = payload.languages.filter((l: string) => l.trim() !== '');
    payload.experiences = payload.experiences.map((e: Partial<Experience>) => this.cleanExperiencePayload(e as Experience));
    payload.projects = payload.projects.map((p: Partial<Project>) => this.cleanMainProjectPayload(p as Project));
    payload.skills = payload.skills.map((s: Partial<SkillItem>) => ({
      ...(s as SkillItem),
      items: (s as SkillItem).items.filter((i: string) => i.trim() !== '')
    }));

    return payload;
  }

  private isEmptyRecognition(rec: Experience['recognition']): boolean {
      if (!rec) return false;
      return !rec.title && !rec.description && !rec.date;
  }

  private cleanExperiencePayload(e: Experience): Experience {
    return {
      ...e,
      responsibilities: e.responsibilities.filter((r: string) => r.trim() !== ''),
      projects: this.cleanExperienceProjectsPayload(e.projects),
      recognition: this.isEmptyRecognition(e.recognition) ? undefined : e.recognition
    };
  }

  private cleanExperienceProjectsPayload(projects?: Experience['projects']): NonNullable<Experience['projects']> {
    const extractedArr = projects || [];
    return extractedArr.map((p: NonNullable<Experience['projects']>[number]) => ({
      ...p,
      points: p.points.filter((pt: string) => pt.trim() !== '')
    }));
  }

  private cleanMainProjectPayload(p: Project & { link?: string }): Project {
    return {
      ...p,
      tags: p.tags?.filter((t: string) => t.trim() !== '') || [],
      techStack: p.techStack.filter((t: string) => t.trim() !== ''),
      features: p.features.filter((f: string) => f.trim() !== ''),
      links: p.link ? [{ label: 'View Project', url: p.link }] : []
    };
  }
}
