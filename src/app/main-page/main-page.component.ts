import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IAppConfig, IProject } from '../interfaces/app-config';
import { AppConfigService } from '../services/app-config.service';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss', '../../assets/styles/hamburger.scss', '../../assets/styles/waves.scss']
})
export class MainPageComponent implements OnInit, AfterViewInit {
  @ViewChild('projectsContainer') projectsContainer!: ElementRef;

  @HostListener('window:resize')
  public onResize(): void {
    this.isMobile = this.isMobileResolution(window.innerWidth);
  }

  @HostListener('mouseup', ['$event'])
  public mouseUpHandler(e: MouseEvent) {
    e.stopPropagation();
    this.mouseDown = false;
  }

  private _texts = ['Hi!', 'My name is Yevheniia', `I'm Front-end developer`];
  private _currentIndex = 0;
  private _timeouts: any[] = [];
  private _pos = { top: 0, left: 0, x: 0, y: 0 };
  private _unsubscribe$ = new Subject<void>();
  public mouseDown = false;
  public isLightTheme = false;
  public showNextComponent = false;
  public isMobile = false;
  public isOpenMenu = false;
  public helloText = '';
  public config: IAppConfig;
  public projects: IProject[] = [];

  constructor(private _translate: TranslateService,
    private _appConfigService: AppConfigService,
    private _scroller: ViewportScroller) {
    this.config = _appConfigService.config;
    _translate.addLangs(['en', 'pl, ua']);
    _translate.setDefaultLang('en');
  }

  public ngOnInit(): void {
    const typeTimeout = setTimeout(() => {
      this.typeLines();
    }, 500);
    this._timeouts.push(typeTimeout);
    this.isMobile = this.isMobileResolution(window.innerWidth);
    for (let i = 0; i < this.config.projectsCount; i++) {
      const item = {
        image: this.config.projects[i].image,
        link: this.config.projects[i].link,
        title: this.config.projects[i].title,
        technologies: this.config.projects[i].technologies,
        text: `PROJECTS.DESCRIPTION${i + 1}`
      };
      this.projects.push(item);
    }
  }

  public ngAfterViewInit(): void {
    fromEvent<MouseEvent>(this.projectsContainer.nativeElement, 'mousedown').pipe(takeUntil(this._unsubscribe$)).subscribe((e: MouseEvent) => {
      e.stopPropagation();
      this.mouseDown = true;
      this._pos = {
        left: this.projectsContainer.nativeElement.scrollLeft,
        top: this.projectsContainer.nativeElement.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };
      fromEvent<MouseEvent>(this.projectsContainer.nativeElement, 'mousemove').pipe(takeUntil(this._unsubscribe$)).subscribe((e: MouseEvent) => {
        e.stopPropagation();
        if (this.mouseDown) {
          const dx = e.clientX - this._pos.x;
          const dy = e.clientY - this._pos.y;
          this.projectsContainer.nativeElement.scrollTop = this._pos.top - dy;
          this.projectsContainer.nativeElement.scrollLeft = this._pos.left - dx;
        }
      });
    });
  }

  public timeout() {
    setTimeout(() => {
      this.projectsContainer.nativeElement.scroll({
        left: 300,
        behavior: "smooth",
      });
      this.timeout();
    }, 10);
    debugger
  }

  public scrollTo(target: string) {
    if (this.isOpenMenu) {
      this.toggleMenu();
    }
    this._scroller.scrollToAnchor(target);
  }

  public toggleMenu(): void {
    this.isOpenMenu = !this.isOpenMenu;
  }

  public onChangeLanguage(lang: string): void {
    switch (lang) {
      case 'en': this._translate.setDefaultLang('en');
        break;
      case 'pl': this._translate.setDefaultLang('pl');
        break;
      case 'ua': this._translate.setDefaultLang('ua');
        break;
      default: this._translate.setDefaultLang('ua');;
    }
    this.toggleMenu()
  }

  public onSkipIntro(): void {
    this._timeouts.forEach(timeout => clearTimeout(timeout));
    this._timeouts = [];
    this.showNextComponent = true;
  }

  public onThemeSwitchChange(): void {
    this.isLightTheme = !this.isLightTheme;
    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
    this.toggleMenu()
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private typeLines(): void {
    if (this._currentIndex < this._texts.length) {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index <= this._texts[this._currentIndex].length) {
          this.helloText = this._texts[this._currentIndex].substring(0, index);
          index++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => this.eraseLine(), 1000);
        }
      }, 100);
    }
  }

  private eraseLine(): void {
    const eraseInterval = setInterval(() => {
      if (this.helloText!.length > 0) {
        this.helloText = this.helloText.slice(0, -1);
      } else {
        clearInterval(eraseInterval);
        this._currentIndex++;

        if (this._currentIndex < this._texts.length) {
          setTimeout(() => this.typeLines(), 500);
        }
      }
    }, 50);
    if (this._currentIndex + 1 >= this._texts.length) {
      setTimeout(() => {
        this.showNextComponent = true;
      }, 1500);
    }
  }

  private isMobileResolution(width: number): boolean {
    return width <= 1024;
  }
}
