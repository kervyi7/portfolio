import { Component, Input } from '@angular/core';
import { IProject } from '../interfaces/app-config';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  @Input() public project!: IProject;
}
