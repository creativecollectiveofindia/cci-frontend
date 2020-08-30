import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { CollectionService } from "../../services/collection.service";
import { User } from "../user.model";
import { ActivatedRoute } from "@angular/router";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"],
})
export class RegistrationComponent implements OnInit {
  form = new FormGroup({});
  user: User;
  submitted = false;
  returnUrl: string;
  error: { errorTitle: ""; errorDesc: "" };
  registrationError: string;
  success: string;
  isSubmitted: string;
  loading: boolean = false;
  socialMediaHandles = [];
  langauageData = "";
  secondaryLangauageData = [];
  langErrorMessage = "";
  registration_id = "";
  registration: any = [];
  websiteErrorMessage = "";
  translation: any;

  constructor(
    private userService: UserService,
    private CollectionService: CollectionService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translationService: TranslationService
  ) {}

  registrationForm = this.fb.group({
    id: [""],
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    email: ["", [Validators.email, Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    password1: ["", Validators.required],
    contact_number: [
      "",
      [
        Validators.required,
        Validators.min(7000000000),
        Validators.max(999999999999),
      ],
    ],
    adult: ["", Validators.required],
    occupation: ["", Validators.required],
    email_notifications: [1],
    role: [3],
    status: ["active"],
    address: [""],
    social_media_handles: [""],
    website_name: [""],
    languages: [""],
    secondary_language: [""],
  });

  ngOnInit() {
    this.translationService.translation.subscribe((result) => {
      this.translation = result;
    });

    this.registration_id = this.activatedRoute.snapshot.params.registration_id;

    if (this.registration_id != undefined) {
      this.getUsersData();
    }
  }

  getdata(event) {
    if (event.target.checked == true) {
      this.socialMediaHandles.push(event.target.value);
    } else if (event.target.checked == false) {
      const index = this.socialMediaHandles.indexOf(event.target.value);
      this.socialMediaHandles.splice(index, 1);
    }
  }

  getLanguages(event) {
    this.langauageData = event.target.value;
  }

  register() {
    this.isSubmitted = "true";
    let formValue = this.registrationForm.value;

    if (formValue.password == "") {
      formValue.password = null;
    }

    if (formValue.password1 == "") {
      formValue.password1 = null;
    }

    if (formValue.password != formValue.password1) {
      document.documentElement.scrollTop = 0;
      this.registrationError = this.translation.messages.passwordNotMatch;
      this.success = "";

      return false;
    }

    delete formValue.password1;
    formValue.social_media_handles = this.socialMediaHandles;
    formValue.languages = this.langauageData;

    if (Object.keys(formValue.secondary_language).length > 3) {
      this.langErrorMessage = this.translation.messages.maxSelectLanguage;
      var errorDiv = document.getElementById("selectLanguage");
      errorDiv.scrollIntoView();

      return false;
    }

    if (
      this.socialMediaHandles.includes("website") &&
      formValue.website_name == ""
    ) {
      this.websiteErrorMessage = this.translation.messages.enterWebsiteName;
      var errorDiv = document.getElementById("social_handlers");
      errorDiv.scrollIntoView();

      return false;
    }

    this.loading = true;

    if (formValue.id != undefined && formValue.id != 0) {
      if (formValue.password == "" || formValue.password == null) {
        delete formValue.password;
      }

      let userId = formValue.id;
      delete formValue.id;

      this.userService.updateItem("users", userId, formValue).subscribe(
        (data) => {
          this.registrationError = this.translation.messages.profileUpdateSuccessful;
          this.success = "";
          formValue.id = userId;
          this.loading = false;
        },
        (error) => {
          this.success = "";
          this.registrationError = this.translation.messages.profileUpdateError;
          this.loading = false;
        }
      );
    } else {
      delete formValue.id;
      this.userService.RegisterUser(formValue).subscribe(
        (data) => {
          this.registrationError = "";
          this.success = this.translation.messages.registrationSuccessful;
          this.loading = false;
        },
        (error) => {
          this.success = "";
          this.registrationError = this.translation.messages.registrationError;
          this.loading = false;
        }
      );
    }

    document.documentElement.scrollTop = 0;

    return false;
  }

  getUsersData() {
    this.userService
      .getItem("users", this.registration_id)
      .subscribe((data) => {
        this.registration = data.data;
        this.socialMediaHandles = data.data.social_media_handles;
        this.langauageData = data.data.languages;

        this.registrationForm = this.fb.group({
          id: [this.registration ? this.registration.id : ""],
          first_name: [
            this.registration ? this.registration.first_name : "",
            Validators.required,
          ],
          last_name: [
            this.registration ? this.registration.last_name : "",
            Validators.required,
          ],
          email: [
            this.registration ? this.registration.email : "",
            [Validators.email, Validators.required],
          ],
          password: [
            this.registration ? this.registration.password : "",
            Validators.minLength(6),
          ],
          password1: [this.registration ? this.registration.password1 : ""],
          contact_number: [
            this.registration ? this.registration.contact_number : "",
            [
              Validators.required,
              Validators.min(7000000000),
              Validators.max(999999999999),
            ],
          ],
          adult: [
            this.registration ? this.registration.adult : "",
            Validators.required,
          ],
          occupation: [
            this.registration ? this.registration.occupation : "",
            Validators.required,
          ],
          email_notifications: [1],
          status: ["active"],
          address: [this.registration ? this.registration.address : ""],
          social_media_handles: [
            this.registration ? this.registration.social_media_handles : "",
          ],
          website_name: [
            this.registration ? this.registration.website_name : "",
          ],
          languages: [this.registration ? this.registration.languages : ""],
          secondary_language: [
            this.registration ? this.registration.secondary_language : "",
          ],
        });
      });
  }
}
