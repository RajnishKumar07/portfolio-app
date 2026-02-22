import { Component } from '@angular/core';
import { RESUME_DATA } from '../../core/data/resume.data';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  data = RESUME_DATA;

  getParagraphs(text: string): string[] {
    return text.split('\\n\\n');
  }
}
