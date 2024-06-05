export interface IAppConfig {
  github: string;
  email: string;
  telegram: string;
  linkedIn: string;
  projectsCount: number;
  languages: IItems[];
  devTools: IItems[];
  projects: IProject[];
}

export interface IItems {
  title: string;
  icon: string;
}

export interface IProject {
  link: string;
  image: string;
  title: string;
  technologies: string;
  text: string;
}