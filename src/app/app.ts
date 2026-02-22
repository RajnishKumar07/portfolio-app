import { Component, signal } from '@angular/core';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { Hero } from './features/hero/hero';
import { About } from './features/about/about';
import { Skills } from './features/skills/skills';
import { Experience } from './features/experience/experience';
import { Projects } from './features/projects/projects';
import { Education } from './features/education/education';
import { ScrollRevealDirective } from './shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Footer,
    Hero,
    About,
    Skills,
    Experience,
    Projects,
    Education,
    ScrollRevealDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio-app');
}
