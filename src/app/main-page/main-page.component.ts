import { Component, ElementRef, NgZone, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss', './hamburger.scss']
})
export class MainPageComponent {
  @ViewChild('textLine') textLine!: ElementRef;

  private _texts: string[] = ['Hi!', 'My name’s Yevheniia', 'I’m Frontend developer'];
  private _currentIndex = 0;
  private _timeouts: any[] = [];
  private _intervals: any[] = [];
  public isLightTheme = false;
  public showNextComponent: boolean = false;
  public isMobile = false;
  public isOpenMenu = false;

  constructor(public translate: TranslateService, private ngZone: NgZone, private renderer: Renderer2) {
    translate.addLangs(['eng', 'pl', 'ua']);
    translate.setDefaultLang('eng');
    this.setIsMobile();
  }

  ngOnInit(): void {
    const typeTimeout = setTimeout(() => {
      this.typeLines();
    }, 1000);

    this._timeouts.push(typeTimeout);
  }

  ngAfterViewInit(): void {
    const nav = document.getElementById("nav-icon3");
    this.renderer.listen(nav, 'click', () => {
      this.toggleMenu();
    });
  }

  private setIsMobile() {
    let screen = window.screen;
    this.ngZone.run(() => {
      this.isMobile = screen.height > screen.width;
    });
  }

  public toggleMenu() {
    let nav = document.getElementById("nav-icon3");
    this.isOpenMenu = !this.isOpenMenu;
    if (this.isOpenMenu) {
      this.renderer.addClass(nav, 'open');
    } else {
      this.renderer.removeClass(nav, 'open');
    }
  }

  onChangeLanguage(language: string): void {
    if (language == 'eng') {
      this.translate.setDefaultLang('eng');
    }
    if (language == 'ua') {
      this.translate.setDefaultLang('ua');
    }
    if (language == 'pl') {
      this.translate.setDefaultLang('pl');
    }
  }

  typeLines(): void {
    if (this._currentIndex < this._texts.length) {
      const line = this.textLine.nativeElement as HTMLElement;
      line.textContent = '';
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index <= this._texts[this._currentIndex].length) {
          line.textContent = this._texts[this._currentIndex].substring(0, index);
          index++;
        } else {
          clearInterval(typeInterval);
          const eraseTimeout = setTimeout(() => this.eraseLine(line), 1000);

          // Store the timeout in the array
          this._timeouts.push(eraseTimeout);
        }
      }, 100);

      line.style.opacity = '1';
    }
  }

  eraseLine(line: HTMLElement): void {
    const eraseInterval = setInterval(() => {
      if (line.textContent!.length > 0) {
        line.textContent = line.textContent!.slice(0, -1);
      } else {
        clearInterval(eraseInterval);
        line.style.opacity = '0';
        this._currentIndex++;

        if (this._currentIndex < this._texts.length) {
          const typeTimeout = setTimeout(() => this.typeLines(), 500);

          // Store the timeout in the array
          this._timeouts.push(typeTimeout);
        }
      }
    }, 50);

    if (this._currentIndex + 1 >= this._texts.length) {
      const showNextComponentTimeout = setTimeout(() => {
        this.showNextComponent = true;
      }, 1500);

      // Store the timeout in the array
      this._timeouts.push(showNextComponentTimeout);
    }
  }

  onSkipIntro() {
    // Clear all _timeouts and intervals
    this._timeouts.forEach(timeout => clearTimeout(timeout));
    this._intervals.forEach(interval => clearInterval(interval));

    // Reset the arrays
    this._timeouts = [];
    this._intervals = [];

    this.showNextComponent = true;
  }

  onThemeSwitchChange() {
    this.isLightTheme = !this.isLightTheme;
    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }
}
