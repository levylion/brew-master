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
    this.generateLogs(20000); // BUG: massive DOM Overload
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
        message: `System event #${i + 1} processing sequence initialized.`,
        // Heavier data structure
        metadata: [
          { key: 'User-Agent', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
          { key: 'Session-ID', value: `sess_${Math.random().toString(36).substring(7)}` },
          { key: 'Trace-ID', value: `trace_${Math.random().toString(36).substring(7)}` }
        ],
        stackTrace: [
          'at Object.process (/app/core/processors.ts:145:12)',
          'at Function.emit (/app/core/events.ts:22:45)',
          'at Service.handle (/app/services/api.ts:89:10)'
        ]
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

  // BUG: CPU Intensive task run in template!
  calculateRiskFactor(id: number): number {
    // Artificial lag: Busy wait
    let start = performance.now();
    while (performance.now() - start < 0.1) {
      // Burn 0.1ms per item. 
      // 20,000 items * 0.1ms = 2000ms (2 seconds) of pure CPU blocking on every check
    }
    return Math.random();
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  // Helper for "heavy" rendering simulation
  getComplexity(id: number): number {
    return Math.sin(id) * 100;
  }
}
