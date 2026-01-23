import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnInit {
  showButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.showButton = window.pageYOffset > 300;
  }

  ngOnInit(): void {}

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

