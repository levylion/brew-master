import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs.html',
  styleUrl: './logs.scss'
})
export class LogsComponent implements OnInit {
  logs: any[] = [];

  ngOnInit() {
    this.generateLogs(10000); // BUG: Initial DOM Overload
  }

  generateLogs(count: number) {
    const severities = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const modules = ['Auth', 'Database', 'Network', 'UI', 'Billing'];

    console.time('Log Generation');
    for (let i = 0; i < count; i++) {
      this.logs.push({
        id: i + 1,
        timestamp: new Date().toISOString(),
        severity: severities[Math.floor(Math.random() * severities.length)],
        module: modules[Math.floor(Math.random() * modules.length)],
        message: `System event #${i + 1} occurred during normal operation processing sequence.`
      });
    }
    console.timeEnd('Log Generation');
  }

  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'INFO': return '#3b82f6';
      case 'WARN': return '#eab308';
      case 'ERROR': return '#ef4444';
      case 'DEBUG': return '#a855f7';
      default: return '#ccc';
    }
  }
}
