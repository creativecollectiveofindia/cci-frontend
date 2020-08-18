import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedListComponent } from './published-list.component';

describe('PublishedListComponent', () => {
  let component: PublishedListComponent;
  let fixture: ComponentFixture<PublishedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
