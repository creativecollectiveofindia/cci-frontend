import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from "@angular/forms";
import { CollectionService } from "../../services/collection.service";
import { Submission } from "../submission";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-submission-form",
  templateUrl: "./submission-form.component.html",
  styleUrls: ["./submission-form.component.css"],
})
export class SubmissionFormComponent implements OnInit {
  @ViewChild("fileDropRef") fileDropEl: ElementRef;
  additionalFields = false;
  files: any[] = [];
  submissionFiles = [];
  savedSubmissionFiles = [];
  savedSubmissionFilesJunctions = [];
  saveSuccessMessage = "";
  saveErrorMessage = "";
  submissionStatus = "";
  translation: any = {};

  selectedTG = [];
  submissionId = "";
  submission: Submission;
  error: object;
  challenges: object;
  submissionLanguages = [];
  submissionRegions = [];
  submissionGeographies = [];
  submissionTargetAudiences = [];
  submissionIncomeBracket = [];
  submissionGender = [];
  submissionAgeGroup = [];
  submissionEducation = [];
  submissionSector = [];
  submissionSpecialCondition = [];
  challengeDetail: any = {
    title: "",
    introduction: "",
    description: "",
    challenge_goal: "",
  };
  challengeId = "";
  checkedValuesTargetAudience = [];
  checkedValuesLanguages = [];
  isSubmitted = false;
  langErrorMessage = "";
  submittedOn = "";
  categories = [];
  topics: object;
  accept = "";
  submissionMediaType = [];
  checkSubmit = "";
  targetAudienceErrorMessage = "";
  loading: boolean = false;
  genderErrorMessage = "";
  sectorErrorMessage = "";
  specialAudienceErrorMessage = "";
  reasonsErrorMessage = "";
  submissionWithdrawReasons = [];
  disableControls = false;

  constructor(
    private CollectionService: CollectionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translationService: TranslationService
  ) {
    this.translation = JSON.parse(sessionStorage.getItem("translation"));
  }

  submissionForm = this.formBuilder.group({
    id: [""],
    title: ["", [Validators.required, Validators.maxLength(120)]],
    status: [""],
    sort: [""],
    owner: [""],
    created_on: [""],
    modified_on: [""],
    modified_by: [""],
    challenge_category: [1, Validators.required],
    challenge: [1, Validators.required],
    file: [""],
    hidden_file: [""],
    language: [this.checkedValuesLanguages],
    target_audience: [this.checkedValuesTargetAudience],
    geography: [""],
    region: ["", Validators.required],
    income_bracket: [""],
    gender: [""],
    age_group: [""],
    educational_background: [""],
    sector: [""],
    special_condition: [""],
    media_type: ["", Validators.required],
    gender_other: [""],
    sector_other: [""],
    target_audience_other: [""],
    special_condition_other: [""],
    language_other: [""],
    withdraw_reasons: [""],
  });

  ngOnInit() {
    this.translation = JSON.parse(sessionStorage.getItem("translation"));
    this.submissionId = this.activatedRoute.snapshot.params.submission_id;

    this.getLanguageOptions();
    this.getTargetAudience();
    this.getGeography();
    this.getRegions();
    this.getIncomeBracket();
    this.getGender();
    this.getAgeGroup();
    this.getEducationalBackground();
    this.getSector();
    this.getSpecialCondition();
    this.getMediaType();
    this.getCategories();
    this.getDefaultTopics();
    this.getDefaultChallenge();
    this.getWithdrawReasons();

    if (this.submissionId) {
      this.getSubmission();
    } else {
      this.submissionStatus = "draft";
    }
  }

  updateSubmission(saveMode) {
    let formValue = this.submissionForm.value;

    delete formValue.hidden_file;
    delete formValue.file;
    delete formValue.created_on;
    delete formValue.modified_by;
    delete formValue.modified_on;
    delete formValue.owner;
    delete formValue.category;
    delete formValue.sort;

    formValue.language = this.checkedValuesLanguages;
    formValue.target_audience = this.checkedValuesTargetAudience;
    formValue.status = saveMode != "" ? saveMode : "submitted";
    this.isSubmitted = true;

    if (formValue.status == "withdrawn" && formValue.withdraw_reasons == "") {
      this.reasonsErrorMessage = this.translation.messages.selectWithdrawReason;
      var errorDiv = document.getElementById("reasonValue");
      errorDiv.scrollIntoView();

      return;
    }

    if (!this.submissionForm.valid) {
      setTimeout(function () {
        let formGroups = document.getElementsByClassName("form-group");

        for (let i = 0; i < formGroups.length; i++) {
          if (formGroups[i].getElementsByClassName("error").length > 0) {
            formGroups[i].scrollIntoView({
              behavior: "smooth",
            });

            break;
          }
        }
      }, 100);

      return;
    }

    if (formValue.status == "submitted" || formValue.status == "draft") {
      if (formValue.gender == "others" && formValue.gender_other == "") {
        this.genderErrorMessage = this.translation.messages.genderRequired;
        var errorDiv = document.getElementById("genderValue");
        errorDiv.scrollIntoView();
        return;
      } else {
        this.genderErrorMessage = "";
      }

      if (formValue.sector == "other" && formValue.sector_other == "") {
        this.sectorErrorMessage = this.translation.messages.sectorRequired;
        var errorDiv = document.getElementById("sectorValue");
        errorDiv.scrollIntoView();
        return;
      } else {
        this.sectorErrorMessage = "";
      }

      /*if (formValue.target_audience.length == 0) {
        this.targetAudienceErrorMessage =
          'Please select profession/occupation.';
        var errorDiv = document.getElementById('targetAudienceCheckDiv');
        errorDiv.scrollIntoView();
        return;
      } else */
      if (
        formValue.target_audience_other == "" &&
        this.selectedTG.includes("other")
      ) {
        this.targetAudienceErrorMessage = this.translation.messages.provideOtherOccupation;
        var errorDiv = document.getElementById("targetAudienceCheckDiv");
        errorDiv.scrollIntoView();
        return;
      } else {
        this.targetAudienceErrorMessage = "";
      }

      if (
        formValue.special_condition == "other" &&
        formValue.special_condition_other == ""
      ) {
        this.specialAudienceErrorMessage = this.translation.messages.provideSpecialCondition;
        var errorDiv = document.getElementById("specialConditionValue");
        errorDiv.scrollIntoView();
        return;
      } else {
        this.specialAudienceErrorMessage = "";
      }

      if (
        this.checkedValuesLanguages.length == 0 ||
        this.checkedValuesLanguages.length > 2
      ) {
        this.langErrorMessage = this.translation.messages.selectTwoLanguage;
        var errorDiv = document.getElementById("langCheckDiv");
        errorDiv.scrollIntoView();
        return;
      } else if (
        this.checkedValuesLanguages.indexOf("other") != -1 &&
        formValue.language_other == ""
      ) {
        this.langErrorMessage = this.translation.messages.selectOtherLanguage;
        var errorDiv = document.getElementById("langCheckDiv");
        errorDiv.scrollIntoView();
        return;
      } else {
        this.langErrorMessage = "";
      }
    }

    for (var prop in formValue) {
      if (formValue[prop] === null || formValue[prop] === undefined) {
        delete formValue[prop];
      }
    }

    this.submissionStatus = formValue.status;

    this.loading = true;

    if (formValue.id != undefined && formValue.id != 0) {
      let submissionId = formValue.id;
      this.CollectionService.updateItem(
        "submission",
        submissionId,
        formValue
      ).subscribe(
        (result) => {
          this.submissionStatus = result.data.status;

          if (result.data.status == "withdrawn") {
            this.router.navigate(["/submission-list/"]);
          } else if (
            result.data.id != undefined &&
            result.data.id != "" &&
            result.data.id > 0
          ) {
            for (var fileIdIndex in this.submissionFiles) {
              let submissionFile = {
                submission_id: result.data.id,
                directus_files_id: this.submissionFiles[fileIdIndex],
              };

              this.CollectionService.createItem(
                "submission_directus_files",
                submissionFile
              ).subscribe((result) => {
                this.savedSubmissionFiles.push(result.data.id);
                let savedFileJunctionData = {
                  junction_id: result.data.id,
                  file_id: this.submissionFiles[fileIdIndex],
                };
                this.savedSubmissionFilesJunctions.push(savedFileJunctionData);
                this.submissionFiles.splice(parseInt(fileIdIndex), 1);
              });
            }

            document.documentElement.scrollTop = 0;
            document.getElementById("submissionSuccessModelBtn").click();
          }

          this.router.navigate(["/submission_form/" + result.data.id]);

          if (saveMode == "withdrawn") {
            this.saveSuccessMessage = this.translation.messages.submissionWithdraw;
          }
        },
        (error) => {
          document.documentElement.scrollTop = 0;
          this.saveErrorMessage = this.translation.messages.somethingWentWrong;
        }
      );
    } else {
      delete formValue.id;

      this.CollectionService.createItem("submission", formValue).subscribe(
        (result) => {
          this.submissionStatus = result.data.status;

          if (
            result.data.id != undefined &&
            result.data.id != "" &&
            result.data.id > 0
          ) {
            for (var fileIdIndex in this.submissionFiles) {
              let submissionFile = {
                submission_id: result.data.id,
                directus_files_id: this.submissionFiles[fileIdIndex],
              };

              this.CollectionService.createItem(
                "submission_directus_files",
                submissionFile
              ).subscribe((fileResult) => {
                this.savedSubmissionFiles.push(fileResult.data.id);
                let savedFileJunctionData = {
                  junction_id: fileResult.data.id,
                  file_id: this.submissionFiles[fileIdIndex],
                };
                this.savedSubmissionFilesJunctions.push(savedFileJunctionData);
                this.submissionFiles.splice(parseInt(fileIdIndex), 1);
              });
            }

            document.documentElement.scrollTop = 0;
            document.getElementById("submissionSuccessModelBtn").click();
          }
        },
        (error) => {
          document.documentElement.scrollTop = 0;
          this.saveErrorMessage = this.translation.messages.somethingWentWrong;
        }
      );
    }

    this.loading = false;
    this.isSubmitted = false;
  }

  redirectToListView() {
    this.router.navigate(["/submission-list"]);
  }

  checkSubmission(saveMode) {
    let formValue = this.submissionForm.value;

    formValue.language = this.checkedValuesLanguages;
    formValue.target_audience = this.checkedValuesTargetAudience;
    formValue.status = saveMode != "" ? saveMode : "submitted";
    this.isSubmitted = true;

    if (formValue.status == "withdrawn" && formValue.withdraw_reasons == "") {
      this.reasonsErrorMessage = this.translation.messages.selectWithdrawReason;
      var errorDiv = document.getElementById("reasonValue");
      errorDiv.scrollIntoView();

      return;
    }

    if (!this.submissionForm.valid) {
      setTimeout(function () {
        let formGroups = document.getElementsByClassName("form-group");

        for (let i = 0; i < formGroups.length; i++) {
          if (formGroups[i].getElementsByClassName("error").length > 0) {
            formGroups[i].scrollIntoView({
              behavior: "smooth",
            });

            break;
          }
        }
      }, 100);

      return;
    }

    if (formValue.status == "submitted" || formValue.status == "draft") {
      if (formValue.gender == "others" && formValue.gender_other == "") {
        this.genderErrorMessage = this.translation.messages.genderRequired;
        var errorDiv = document.getElementById("genderValue");
        errorDiv.scrollIntoView();

        return;
      } else {
        this.genderErrorMessage = "";
      }

      if (formValue.sector == "other" && formValue.sector_other == "") {
        this.sectorErrorMessage = this.translation.messages.sectorRequired;
        var errorDiv = document.getElementById("sectorValue");
        errorDiv.scrollIntoView();

        return;
      } else {
        this.sectorErrorMessage = "";
      }

      /*if (formValue.target_audience.length == 0) {
        this.targetAudienceErrorMessage =
          'Please select profession/occupation.';
        var errorDiv = document.getElementById('targetAudienceCheckDiv');
        errorDiv.scrollIntoView();
        return;
      } else */
      if (
        formValue.target_audience_other == "" &&
        this.selectedTG.includes("other")
      ) {
        this.targetAudienceErrorMessage = this.translation.messages.provideOtherOccupation;
        var errorDiv = document.getElementById("targetAudienceCheckDiv");
        errorDiv.scrollIntoView();

        return;
      } else {
        this.targetAudienceErrorMessage = "";
      }

      if (
        formValue.special_condition == "other" &&
        formValue.special_condition_other == ""
      ) {
        this.specialAudienceErrorMessage = this.translation.messages.provideSpecialCondition;
        var errorDiv = document.getElementById("specialConditionValue");
        errorDiv.scrollIntoView();

        return;
      } else {
        this.specialAudienceErrorMessage = "";
      }

      if (
        this.checkedValuesLanguages.length == 0 ||
        this.checkedValuesLanguages.length > 2
      ) {
        this.langErrorMessage = this.translation.messages.selectTwoLanguage;
        var errorDiv = document.getElementById("langCheckDiv");
        errorDiv.scrollIntoView();

        return;
      } else if (
        this.checkedValuesLanguages.indexOf("other") != -1 &&
        formValue.language_other == ""
      ) {
        this.langErrorMessage = this.translation.messages.selectOtherLanguage;
        var errorDiv = document.getElementById("langCheckDiv");
        errorDiv.scrollIntoView();

        return;
      } else {
        this.langErrorMessage = "";
      }
    }

    this.isSubmitted = false;
    document.getElementById("submitSubmission").click();
  }

  cancelSubmission() {
    this.router.navigate(["/submission-list"]);
  }

  onFileSelect(event) {
    if (this.submissionStatus != "draft") {
      this.saveErrorMessage = this.translation.messages.submissionUneditable;
      document.documentElement.scrollTop = 0;
      return;
    }

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let fileData = {
        name: file.name,
        size: file.size,
        fileId: "",
        progress: {},
      };
      this.files.push(fileData);

      this.CollectionService.uploadFile(file).subscribe((result) => {
        if (result.data != undefined && result.data.id != undefined) {
          fileData.fileId = result.data.id;
          this.submissionFiles.push(result.data.id);

          this.submissionForm.get("hidden_file").reset();
        } else if (result.status != undefined && result.status == "progress") {
          fileData.progress = result;
        }
      });
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  deleteFile(file) {
    if (this.submissionStatus != "draft") {
      this.saveErrorMessage = this.translation.messages.submissionUneditable;
      document.documentElement.scrollTop = 0;
      return;
    }

    this.CollectionService.deleteFile(file.fileId).subscribe((result) => {
      const arrayIndex = this.submissionFiles.indexOf(file.fileId);

      if (arrayIndex >= 0) {
        this.submissionFiles.splice(arrayIndex, 1);
      }

      for (var fileIndex in this.files) {
        if (this.files[fileIndex].fileId == file.fileId) {
          this.files.splice(parseInt(fileIndex), 1);
        }
      }

      for (var fileJunctionMapIndex in this.savedSubmissionFilesJunctions) {
        if (
          this.savedSubmissionFilesJunctions[fileJunctionMapIndex].file_id ==
          file.fileId
        ) {
          let fileJunctionId = this.savedSubmissionFilesJunctions[
            fileJunctionMapIndex
          ].junction_id;

          this.CollectionService.deleteItem(
            "submission_directus_files",
            fileJunctionId
          ).subscribe((data) => {
            if (
              this.savedSubmissionFilesJunctions[fileJunctionMapIndex] !=
              undefined
            ) {
              this.savedSubmissionFilesJunctions.splice(
                parseInt(fileJunctionMapIndex),
                1
              );
            }
          });
        }
      }

      for (var savedFileIndex in this.savedSubmissionFiles) {
        if (
          this.savedSubmissionFiles[savedFileIndex].id != undefined &&
          this.savedSubmissionFiles[savedFileIndex].id == file.fileId
        ) {
          this.savedSubmissionFiles.splice(parseInt(savedFileIndex), 1);
        }
      }
    });
  }

  getSubmission() {
    this.CollectionService.getItem("submission", this.submissionId).subscribe(
      (data) => {
        this.submission = data.data;
        this.submissionStatus = data.data.status;
        this.submittedOn = new Date(data.data.modified_on + " UTC").toString();
        this.checkedValuesLanguages = data.data.language;
        this.selectedTG = data.data.target_audience;
        this.checkedValuesTargetAudience = data.data.target_audience;

        this.submissionForm = this.formBuilder.group({
          id: [this.submission ? this.submission.id : ""],
          title: [
            this.submission ? this.submission.title : "",
            [Validators.required, Validators.maxLength(120)],
          ],
          status: [this.submission ? this.submission.status : ""],
          sort: [this.submission ? this.submission.sort : ""],
          owner: [this.submission ? this.submission.owner : ""],
          created_on: [this.submission ? this.submission.created_on : ""],
          modified_on: [this.submission ? this.submission.modified_on : ""],
          modified_by: [this.submission ? this.submission.modified_by : ""],
          challenge_category: [
            this.submission ? this.submission.challenge_category : "",
            Validators.required,
          ],
          challenge: [
            this.submission ? this.submission.challenge : "",
            Validators.required,
          ],
          file: [this.submission ? this.submission.file : ""],
          hidden_file: [""],
          language: [this.submission ? this.submission.language : ""],
          target_audience: [
            this.submission ? this.submission.target_audience : "",
          ],
          geography: [
            this.submission ? this.submission.geography : "",
            Validators.required,
          ],
          region: [
            this.submission ? this.submission.region : "",
            Validators.required,
          ],
          income_bracket: [
            this.submission ? this.submission.income_bracket : "",
            Validators.required,
          ],
          gender: [
            this.submission ? this.submission.gender : "",
            Validators.required,
          ],
          age_group: [
            this.submission ? this.submission.age_group : "",
            Validators.required,
          ],
          educational_background: [
            this.submission ? this.submission.educational_background : "",
          ],
          sector: [this.submission ? this.submission.sector : ""],
          special_condition: [
            this.submission ? this.submission.special_condition : "",
          ],
          media_type: [
            this.submission ? this.submission.media_type : "",
            Validators.required,
          ],
          gender_other: [this.submission ? this.submission.gender_other : ""],
          sector_other: [this.submission ? this.submission.sector_other : ""],
          target_audience_other: [
            this.submission ? this.submission.target_audience_other : "",
          ],
          special_condition_other: [
            this.submission ? this.submission.special_condition_other : "",
          ],
          language_other: [
            this.submission ? this.submission.language_other : "",
          ],
          withdraw_reasons: [
            this.submission ? this.submission.withdraw_reasons : "",
          ],
        });

        this.CollectionService.getItems(
          "creative_challenge",
          "?filter[category][eq]=" + this.submission.challenge_category
        ).subscribe((challengeResult) => {
          this.topics = challengeResult.data;
        });

        let challengeId = <unknown>this.submission.challenge;
        this.CollectionService.getItem(
          "creative_challenge",
          <string>challengeId
        ).subscribe((data) => {
          this.challengeDetail = data.data;
        });
      }
    );

    this.CollectionService.getItems(
      "submission_directus_files",
      `?filter[submission_id][eq]=${this.submissionId}&fields=*.*`
    ).subscribe((data) => {
      for (var fileData in data.data) {
        let savedFileData = {
          size: data.data[fileData].directus_files_id.filesize,
          name: data.data[fileData].directus_files_id.title,
          fileId: data.data[fileData].directus_files_id.id,
        };
        this.savedSubmissionFiles.push(data.data[fileData].directus_files_id);
        let savedFileJunctionData = {
          junction_id: data.data[fileData].id,
          file_id: data.data[fileData].directus_files_id.id,
        };
        this.savedSubmissionFilesJunctions.push(savedFileJunctionData);
        this.files.push(savedFileData);
      }

      if (
        this.submissionStatus == "submitted" ||
        this.submissionStatus == "published" ||
        this.submissionStatus == "withdrawn"
      ) {
        this.disableControls = true;

        for (let formField in this.submissionForm.controls) {
          if (formField != "withdraw_reasons" && formField != "id") {
            this.submissionForm.get(formField).disable();
          }
        }
      }
    });
  }

  resetSubmission() {
    this.challengeDetail = [];
    this.selectedTG = [];
    this.checkedValuesLanguages = [];
    this.submissionForm.get("file").reset();
    this.submissionForm.reset();
  }

  getRegions() {
    this.CollectionService.getField("submission", "region").subscribe(
      (result) => {
        let regionOptions = [];
        for (var region in result.data.options.choices) {
          let regionObj = {
            value: region,
            label: result.data.options.choices[region],
          };
          regionOptions.push(regionObj);
        }

        this.submissionRegions = regionOptions;
      }
    );
  }

  getTargetAudience() {
    this.CollectionService.getField("submission", "target_audience").subscribe(
      (result) => {
        let targetAudienceOptions = [];
        for (var targetAudience in result.data.options.choices) {
          let targetAudienceObj = {
            value: targetAudience,
            label: result.data.options.choices[targetAudience],
          };
          targetAudienceOptions.push(targetAudienceObj);
        }

        this.submissionTargetAudiences = targetAudienceOptions;
      }
    );
  }

  getGeography() {
    this.CollectionService.getField("submission", "geography").subscribe(
      (result) => {
        let geographyOptions = [];
        for (var geography in result.data.options.choices) {
          let geographyObj = {
            value: geography,
            label: result.data.options.choices[geography],
          };
          geographyOptions.push(geographyObj);
        }

        this.submissionGeographies = geographyOptions;
      }
    );
  }

  getLanguageOptions() {
    this.CollectionService.getField("submission", "language").subscribe(
      (result) => {
        let langOptions = [];
        for (var lang in result.data.options.choices) {
          let langObj = {
            value: lang,
            label: result.data.options.choices[lang],
          };
          langOptions.push(langObj);
        }

        this.submissionLanguages = langOptions;
      }
    );
  }

  getIncomeBracket() {
    this.CollectionService.getField("submission", "income_bracket").subscribe(
      (result) => {
        let incomeOptions = [];
        for (var income in result.data.options.choices) {
          let langObj = {
            value: income,
            label: result.data.options.choices[income],
          };
          incomeOptions.push(langObj);
        }
        this.submissionIncomeBracket = incomeOptions;
      }
    );
  }

  getGender() {
    this.CollectionService.getField("submission", "gender").subscribe(
      (result) => {
        let genderOptions = [];
        for (var gender in result.data.options.choices) {
          let genderObj = {
            value: gender,
            label: result.data.options.choices[gender],
          };
          genderOptions.push(genderObj);
        }
        this.submissionGender = genderOptions;
      }
    );
  }

  getAgeGroup() {
    this.CollectionService.getField("submission", "age_group").subscribe(
      (result) => {
        let ageOptions = [];
        for (var age in result.data.options.choices) {
          let ageObj = { value: age, label: result.data.options.choices[age] };
          ageOptions.push(ageObj);
        }
        this.submissionAgeGroup = ageOptions;
      }
    );
  }

  getEducationalBackground() {
    this.CollectionService.getField(
      "submission",
      "educational_background"
    ).subscribe((result) => {
      let eduOptions = [];
      for (var edu in result.data.options.choices) {
        let eduObj = { value: edu, label: result.data.options.choices[edu] };
        eduOptions.push(eduObj);
      }
      this.submissionEducation = eduOptions;
    });
  }

  getSector() {
    this.CollectionService.getField("submission", "sector").subscribe(
      (result) => {
        let sectorOptions = [];
        for (var sec in result.data.options.choices) {
          let sectorObj = {
            value: sec,
            label: result.data.options.choices[sec],
          };
          sectorOptions.push(sectorObj);
        }
        this.submissionSector = sectorOptions;
      }
    );
  }

  getSpecialCondition() {
    this.CollectionService.getField(
      "submission",
      "special_condition"
    ).subscribe((result) => {
      let specialConditionOptions = [];
      for (var specialCondition in result.data.options.choices) {
        let specialConditionObj = {
          value: specialCondition,
          label: result.data.options.choices[specialCondition],
        };
        specialConditionOptions.push(specialConditionObj);
      }
      this.submissionSpecialCondition = specialConditionOptions;
    });
  }

  onCheckTargetAudience(event) {
    if (event.target.checked == true) {
      this.checkedValuesTargetAudience.push(event.target.value);
    } else {
      const index = this.checkedValuesTargetAudience.indexOf(
        event.target.value
      );
      this.checkedValuesTargetAudience.splice(index, 1);
    }
  }

  onCheckLanguages(event) {
    if (
      this.checkedValuesLanguages.length > 1 &&
      event.target.checked == true
    ) {
      this.langErrorMessage = this.translation.messages.maxSelectLanguageTwo;
      event.target.checked = false;
      var errorDiv = document.getElementById("langCheckDiv");
      errorDiv.scrollIntoView();

      return;
    } else {
      this.langErrorMessage = "";
    }

    if (event.target.checked == true) {
      this.checkedValuesLanguages.push(event.target.value);
    } else if (event.target.checked == false) {
      const index = this.checkedValuesLanguages.indexOf(event.target.value);
      this.checkedValuesLanguages.splice(index, 1);
    }
  }

  onChanges(event) {
    this.CollectionService.getItem(
      "creative_challenge",
      event.target.value
    ).subscribe((data) => {
      this.challengeDetail = data.data;
    });
  }

  getDefaultChallenge() {
    this.CollectionService.getItem("creative_challenge", "1").subscribe(
      (data) => {
        this.challengeDetail = data.data;
      }
    );
  }

  getCategories() {
    this.CollectionService.getItems("challenge_category").subscribe(
      (result) => {
        this.categories = result.data;
      }
    );
  }

  getDefaultTopics() {
    this.CollectionService.getItems(
      "creative_challenge",
      "?filter[category][eq]=1"
    ).subscribe((challengeResult) => {
      this.topics = challengeResult.data;
    });
  }

  getChallenges(event) {
    this.CollectionService.getItems(
      "creative_challenge",
      "?filter[category][eq]=" + event.target.value
    ).subscribe((challengeResult) => {
      this.topics = challengeResult.data;
    });
  }

  getMediaType() {
    this.CollectionService.getField("submission", "media_type").subscribe(
      (result) => {
        let mediaOptions = [];
        for (var media in result.data.options.choices) {
          let mediaObj = {
            value: media,
            label: result.data.options.choices[media],
          };
          mediaOptions.push(mediaObj);
        }
        this.submissionMediaType = mediaOptions;
      }
    );
  }

  selectFileType(e) {
    if (e.target.value == "image") {
      this.accept = ".jpg,.jpeg,.png";
    } else if (e.target.value == "video") {
      this.accept = ".mp4";
    } else if (e.target.value == "audio") {
      this.accept = ".mp3";
    } else if (e.target.value == "document") {
      this.accept = ".pdf";
    }
  }

  deleteSubmission() {
    this.loading = true;
    let formValue = this.submissionForm.value;
    this.CollectionService.deleteItem("submission", formValue.id).subscribe(
      (data) => {
        this.router.navigate(["/submission-list/"]);
      }
    );
  }

  check(event) {
    if (event.target.checked == true) {
      this.checkSubmit = "true";
    } else if (event.target.checked == false) {
      this.checkSubmit = "false";
    }
  }

  getWithdrawReasons() {
    this.CollectionService.getField("submission", "withdraw_reasons").subscribe(
      (result) => {
        let reasonsOptions = [];
        for (var reasons in result.data.options.choices) {
          let reasonsObj = {
            value: reasons,
            label: result.data.options.choices[reasons],
          };
          reasonsOptions.push(reasonsObj);
        }
        this.submissionWithdrawReasons = reasonsOptions;
      }
    );
  }
}
