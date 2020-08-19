import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PublishedDetailComponent } from "./published-detail.component";

describe("PublishedDetailComponent", () => {
  let component: PublishedDetailComponent;
  let fixture: ComponentFixture<PublishedDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
