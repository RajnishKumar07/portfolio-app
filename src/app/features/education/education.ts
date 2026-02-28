import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RESUME_DATA } from '../../core/data/resume.data';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-education',
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './education.html',
  styleUrl: './education.scss'
})
export class Education {
  data = RESUME_DATA;
}
