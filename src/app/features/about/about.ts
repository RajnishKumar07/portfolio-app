import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RESUME_DATA } from '../../core/data/resume.data';
import { CountUpDirective } from '../../shared/directives/count-up.directive';

@Component({
  selector: 'app-about',
  imports: [CommonModule, CountUpDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  data = RESUME_DATA;

  getParagraphs(text: string): string[] {
    return text.split('\\n\\n');
  }
}
