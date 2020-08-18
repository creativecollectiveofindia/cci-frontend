import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { Submission } from '../submission';
import { Review } from './review';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})

export class SubmissionComponent implements OnInit {
  submissionDetail: any = [];
  challengeDetail: any = [];
  submissionFiles: any = [];
  submissions: any = [];
  review: Review;
  files = '';
  submissionId = '';
  challengeId ='';
  submission: Submission;
  isSubmitted = false;
  filename = '';
  filepath = '';
  reviewError: String;
  reviewSuccessMsg: String;
  submitted = '';
  submissionStatus = 'draft';
  lastReviewDate: Date;
  today: Date;
  reviewFormFields: Object = {};

  constructor(private CollectionService: CollectionService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) { }

  reviewForm = this.formBuilder.group({
    id: [''],
    owner: [''],
    created_on: [''],
    modified_by: [''],
    modified_on: [''],
    target_audience: ['', Validators.required],
    target_audience_representation: ['', Validators.required],
    target_audience_nonrep_reason: [''],
    areas_of_concern:[''],
    related:['', Validators.required],
    target_audience_nonrel_reason:[''],
    areas_of_concern1:[''],
    key_behaviour:['', Validators.required],
    key_behaviour_representation:[''],
    key_behaviour_no_rep_reason:[''],
    key_behaviour_areas_of_concern:[''],
    good_to_have_information:['', Validators.required],
    good_to_have_information_representation:[''],
    good_to_have_information_norep_reason:[''],
    good_to_have_norep_reason:[''],
    key_behaviour_practice:['', Validators.required],
    key_behaviour_practice_correct:[''],
    key_behaviour_no_practiced:[''],
    key_behaviour_nopracticed_concern:[''],
    evaluation_criteria:['', Validators.required],
    pan_india:['', Validators.required],
    apply_to_specific_community:['', Validators.required],
    submission_id:[''],
    status:[''],
    review_result:[''],
    review_score:['']
  });

  ngOnInit() {
    this.submissionId = this.activatedRoute.snapshot.params.submission_id;
    this.getReviewFormFields();
    this.getSubmission();
    this.getReview();
  }

  getReviewFormFields () {
    this.CollectionService.getFields('submission_review').subscribe(data => {
      for (var fieldData in data.data)
      {
        this.reviewFormFields[data.data[fieldData].field] = data.data[fieldData];

        if (this.reviewFormFields[data.data[fieldData].field]['options'] !== null)
        {
          if (this.reviewFormFields[data.data[fieldData].field]['options']['choices'] != undefined)
          {
            let choiceArray = [];

            for (var choice in this.reviewFormFields[data.data[fieldData].field]['options']['choices']) {
              let choiceObj = {value: choice, label: this.reviewFormFields[data.data[fieldData].field]['options']['choices'][choice]};
              choiceArray.push(choiceObj);
            }

            this.reviewFormFields[data.data[fieldData].field]['options']['choices'] = choiceArray;
          }
        }
      }
    });
  }

  getSubmission() {
    this.CollectionService.getItem('submission', this.submissionId+'?fields=*.*').subscribe(data => {
      this.submissionDetail = data.data;
      this.challengeDetail = data.data.challenge;
      this.getSubmissionFiles(data.data.id);
      this.reviewDate();
    });
  }

  getSubmissionFiles(submissionId) {
    this.CollectionService.getItems('submission_directus_files', `?filter[submission_id][eq]=${submissionId}&fields=directus_files_id.*`).subscribe(data => {
      this.submissionFiles = data.data;
    })
  }

  humanize(data){
    var i = 0;
    if(Array.isArray(data)){
      for (i=0; i<data.length; i++) {
        data[i] = data[i].replace('_', ' ').replace(/(?:^|\s)\S/g, a => a.toUpperCase());
          }
          return data.filter(Boolean);
    }else{
      if (data != undefined)
      {
        return data.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
      }

      return "";
    }
  }

  previewImage (imgSrc){
    let modal = document.getElementById("myModal");
    let modalImg = document.getElementById("myModalImg");
    modal.style.display = "block";

    if ((modalImg as HTMLImageElement).src != undefined)
    {
      (modalImg as HTMLImageElement).src = imgSrc;
    }
  }

  closePreview (){
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
    let modalImg = document.getElementById("myModalImg");
  }

  onChangeRelated(){
    let selected = this.reviewForm.get('related').value;

    if (selected != 'yes') {
      this.reviewForm.get('target_audience_nonrel_reason').setValidators(Validators.required);
      this.reviewForm.get('target_audience_nonrel_reason').enable();
      this.reviewForm.get('areas_of_concern1').enable();
    }
    else{
      this.reviewForm.get('target_audience_nonrel_reason').setValidators(null);
      this.reviewForm.get('target_audience_nonrel_reason').reset();
      this.reviewForm.get('areas_of_concern1').reset();
      this.reviewForm.get('target_audience_nonrel_reason').disable();
      this.reviewForm.get('areas_of_concern1').disable();
    }
  }

  onChangeTargetAudienceRep(){
    let selected = this.reviewForm.get('target_audience_representation').value;

    if (selected == 'no') {
      this.reviewForm.get('target_audience_nonrep_reason').setValidators(Validators.required);
      this.reviewForm.get('target_audience_nonrep_reason').enable();
      this.reviewForm.get('areas_of_concern').enable();
    }
    else
    {
      this.reviewForm.get('target_audience_nonrep_reason').setValidators(null);
      this.reviewForm.get('target_audience_nonrep_reason').reset();
      this.reviewForm.get('areas_of_concern').reset();
      this.reviewForm.get('target_audience_nonrep_reason').disable();
      this.reviewForm.get('areas_of_concern').disable();
    }
  }

  onChangeGoodToHaveInformationRepresentation(){
    let selected = this.reviewForm.get('good_to_have_information_representation').value;

    if (selected != 'yes') {
      this.reviewForm.get('good_to_have_information_norep_reason').enable();
      this.reviewForm.get('good_to_have_norep_reason').enable();
    }
    else
    {
      this.reviewForm.get('good_to_have_information_norep_reason').disable();
      this.reviewForm.get('good_to_have_norep_reason').disable();
      this.reviewForm.get('good_to_have_information_norep_reason').reset();
      this.reviewForm.get('good_to_have_norep_reason').reset();
    }
  }

  onChangeKeyBehaviourRepresentation(){
    let selected = this.reviewForm.get('key_behaviour_representation').value;

    if (selected != 'yes') {
      this.reviewForm.get('key_behaviour_no_rep_reason').setValidators(Validators.required);
      this.reviewForm.get('key_behaviour_no_rep_reason').enable();
      this.reviewForm.get('key_behaviour_areas_of_concern').enable();
    }
    else
    {
      this.reviewForm.get('key_behaviour_no_rep_reason').setValidators(null);
      this.reviewForm.get('key_behaviour_no_rep_reason').disable();
      this.reviewForm.get('key_behaviour_areas_of_concern').disable();
      this.reviewForm.get('key_behaviour_no_rep_reason').reset();
      this.reviewForm.get('key_behaviour_areas_of_concern').reset();
    }
  }

  onChangeKeyBehaviourPractice() {
    let selected = this.reviewForm.get('key_behaviour_practice').value;

    if (selected != 'yes') {
      this.reviewForm.get('key_behaviour_no_practiced').setValidators(Validators.required);
      this.reviewForm.get('key_behaviour_no_practiced').enable();
      this.reviewForm.get('key_behaviour_nopracticed_concern').enable();
    }
    else
    {
      this.reviewForm.get('key_behaviour_no_practiced').setValidators(null);
      this.reviewForm.get('key_behaviour_no_practiced').disable();
      this.reviewForm.get('key_behaviour_nopracticed_concern').disable();
      this.reviewForm.get('key_behaviour_no_practiced').reset();
      this.reviewForm.get('key_behaviour_nopracticed_concern').reset();
    }
  }

  updateReview (saveMode){
    this.isSubmitted = true;
    let formValue = this.reviewForm.value;
    this.submissionStatus = formValue.status;
    formValue.review_score = this.calculateScore();
    formValue.status = (saveMode == 'draft') ? 'draft' : 'submitted';
    formValue.submission_id = this.submissionId;

    if (!this.reviewForm.valid)
    {
      setTimeout(function(){
        let formGroups = document.getElementsByClassName('form-group');

        for (let i = 0; i < formGroups.length; i++) {
          if (formGroups[i].getElementsByClassName('error').length > 0)
          {
            formGroups[i].scrollIntoView({
              behavior: 'smooth'
            });
  
            break;
          }
        }
      }, 100);

      return;
    }

    if (formValue.id != undefined && formValue.id != 0)
    {
      let reviewId = formValue.id;
      delete formValue.id;

      this.CollectionService.updateItem('submission_review', reviewId, formValue).subscribe(result => {
        if (result.data.id != undefined && result.data.id != "" && result.data.id > 0)
        {
          this.submissionStatus = result.data.status;
          document.documentElement.scrollTop = 0;
          document.getElementById("reviewSuccessBtn").click();
        }
      },
      (error) => {
        document.documentElement.scrollTop = 0;
        this.reviewError = 'Something went wrong, Please try again later.';
      });
    }
    else
    {
      delete formValue.id;

      this.CollectionService.createItem('submission_review', formValue).subscribe(result => {
        if (result.data.id != undefined && result.data.id != "" && result.data.id > 0)
        {
          this.submissionStatus = result.data.status;
          document.documentElement.scrollTop = 0;
          document.getElementById("reviewSuccessBtn").click();
        }
      },
      (error) => {
        document.documentElement.scrollTop = 0;
        this.reviewError = 'Something bad happened. Please try again later.';
      });
    }
  }

  cancelReview (){
    this.reviewForm.reset(result => {
       this.isSubmitted = false;
    });
  }

  getReview() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.CollectionService.getItems('submission_review','?filter[submission_id][eq]='+this.submissionId+'&[owner]='+currentUser.data.user.id).subscribe(result => {
      if(result.data[0]) {
        this.submissionStatus = result.data[0].status;
        this.review = result.data[0];

        if (this.submissionStatus == 'submitted'){
          this.submitted= 'true';
          this.reviewSuccessMsg = "You have reviewed this submission";
        }

        this.reviewForm = this.formBuilder.group({
          id: [this.review ? this.review.id : ''],
          owner: [this.review ? this.review.owner : ''],
          created_on: [this.review ? this.review.created_on : ''],
          modified_on: [this.review ? this.review.modified_on : ''],
          modified_by: [this.review ? this.review.modified_by : ''],
          target_audience_nonrel_reason: [this.review ? this.review.target_audience_nonrel_reason : ''],
          areas_of_concern1: [this.review ? this.review.areas_of_concern1 : '', this.review.areas_of_concern1 ? [Validators.required] : []],
          related: [this.review ? this.review.related : '', Validators.required],
          target_audience: [this.review ? this.review.target_audience : '', Validators.required],
          target_audience_representation: [this.review ? this.review.target_audience_representation : '', Validators.required],
          target_audience_nonrep_reason: [this.review ? this.review.target_audience_nonrep_reason : ''],
          areas_of_concern: [this.review ? this.review.areas_of_concern : '', this.review.areas_of_concern ? [Validators.required] : []],
          key_behaviour: [this.review ? this.review.key_behaviour : '', Validators.required],
          key_behaviour_representation: [this.review ? this.review.key_behaviour_representation : ''],
          key_behaviour_no_rep_reason: [this.review ? this.review.key_behaviour_no_rep_reason : ''],
          key_behaviour_areas_of_concern: [this.review ? this.review.key_behaviour_areas_of_concern : '', this.review.key_behaviour_areas_of_concern ? [Validators.required] : []],
          good_to_have_information: [this.review ? this.review.good_to_have_information : '', Validators.required],
          good_to_have_information_representation: [this.review ? this.review.good_to_have_information_representation : ''],
          good_to_have_information_norep_reason: [this.review ? this.review.good_to_have_information_norep_reason : ''],
          good_to_have_norep_reason: [this.review ? this.review.good_to_have_norep_reason : ''],
          key_behaviour_practice: [this.review ? this.review.key_behaviour_practice : '', Validators.required],
          key_behaviour_practice_correct: [this.review ? this.review.key_behaviour_practice_correct : ''],
          key_behaviour_no_practiced: [this.review ? this.review.key_behaviour_no_practiced : ''],
          key_behaviour_nopracticed_concern: [this.review ? this.review.key_behaviour_nopracticed_concern : '', this.review.key_behaviour_nopracticed_concern ? [Validators.required] : []],
          evaluation_criteria: [this.review ? this.review.evaluation_criteria : '', Validators.required],
          pan_india: [this.review ? this.review.pan_india : '', Validators.required],
          apply_to_specific_community: [this.review ? this.review.apply_to_specific_community : '', Validators.required],
          submission_id: [this.review ? this.review.submission_id : ''],
        });

        if (this.submissionStatus == "submitted")
        {
          for (let formField in this.reviewForm.controls)
          {
            this.reviewForm.get(formField).disable();
          }
        }
      }
    });
  }

  reviewDate()
  {
    this.CollectionService.getItem('configuration', '1').subscribe(data => {
      this.lastReviewDate = new Date(this.submissionDetail.modified_on);
      this.lastReviewDate.setDate(this.lastReviewDate.getDate() + data.data.days_to_complete_review);
    });

    this.today = new Date();

    if(this.lastReviewDate < this.today)
    {
      this.submitted= 'true';
    }
  }

  calculateScore()
  {
      let score = 0;
      if(this.reviewForm.value.target_audience == 'yes'){ score = score + 10; }
      if(this.reviewForm.value.target_audience_representation == 'yes'){ score = score + 15; }
      if(this.reviewForm.value.related == 'yes'){ score = score + 15; }
      if(this.reviewForm.value.key_behaviour == 'yes'){ score = score + 30; }
      if(this.reviewForm.value.good_to_have_information == 'yes'){ score = score + 10; }

      if(this.reviewForm.value.evaluation_criteria == 'absolutely_amazing'){ score = score + 10; }
      else if(this.reviewForm.value.evaluation_criteria == 'great'){ score = score + 8; }
      else if(this.reviewForm.value.evaluation_criteria == 'good'){ score = score + 6; }
      else if(this.reviewForm.value.evaluation_criteria == 'ok'){ score = score + 4; }
      else if(this.reviewForm.value.evaluation_criteria == 'poor'){ score = score + 2; }

      if(this.reviewForm.value.pan_india == 'yes'){ score = score + 5; }
      if(this.reviewForm.value.apply_to_specific_community == 'yes'){ score = score + 5; }

      return score;
  }
}
