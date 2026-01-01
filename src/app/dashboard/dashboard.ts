import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('thrashingTarget') thrashingTarget!: ElementRef;

  intervalid: any;

  batches = [
    { name: 'Golden Ale', status: 'Fermenting', date: '2023-10-25', icon: '🍺' },
    { name: 'Imperial Stout', status: 'Aging', date: '2023-10-10', icon: '⚫' },
    { name: 'Hazy IPA', status: 'Boiling', date: 'Today', icon: '🌫️' }
  ];

  ngOnInit() {
    // BUG: Layout Thrashing / Forced Reflow
    // This interval forces the browser to recalculate layout every 100ms
    // by reading a layout property (offsetHeight) and then writing to style.
    this.intervalid = setInterval(() => {
      if (this.thrashingTarget) {
        const el = this.thrashingTarget.nativeElement;
        // READ
        const height = el.offsetHeight;
        // WRITE
        el.style.height = (height + (Math.random() > 0.5 ? 1 : -1)) + 'px';
        // READ AGAIN (Forces layout)
        const newHeight = el.offsetHeight;
        // WRITE AGAIN
        el.style.width = (newHeight + 100) + 'px';
      }
    }, 50); // Fast interval to be noticeable in profiler
  }

  ngOnDestroy() {
    if (this.intervalid) clearInterval(this.intervalid);
  }
}
