import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-scanners',
  templateUrl: './dashboard-scanners.component.html',
  styleUrls: ['./dashboard-scanners.component.css']
})
export class DashboardScannersComponent implements OnInit {
  
  public constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigateByUrl("https://www.google.com");
  }

}
