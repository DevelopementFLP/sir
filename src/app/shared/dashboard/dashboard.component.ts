import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public constructor(private router: Router) {}

  ngOnInit(): void {
   window.location.href = "http://192.168.1.82:85"
  }

}
