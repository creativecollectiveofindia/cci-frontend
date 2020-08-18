import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Submission } from '../submission';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-submission-list',
  templateUrl: './submission-list.component.html',
  styleUrls: ['./submission-list.component.css']
})
export class SubmissionListComponent implements OnInit {
  submissionList:any=[];
  submission: Submission;
  result = [];
  isReviwer: boolean = false;
  isCreator: boolean = false;
  offset = 0;
  limit = 10;
  flag = 0;
  status = '';
  filters = '';
  statusData = [];
  statusFilter = '';
  submissionFiles = [];
  submissionId = '';
  reviews = [];

  constructor(private CollectionService: CollectionService,private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder,private AuthService:AuthService,private router: Router) { 
    this.isReviwer = this.AuthService.isReviewer();
    this.isCreator = this.AuthService.isCreator();
  }

  ngOnInit() {
    this.getSubmissionList();
    this.getStatus(); 
  }

  onChanges(e)
  {
    this.statusFilter = e.target.value;
    this.offset = 0;
    this.flag = 0;
    this.getSubmissionList();
  }

  getSubmissionList(isPrev?,isNext?) {
    if (isNext)
    {
      this.flag++;
    }
    if (isPrev)
    {
      this.flag--;
    }
    this.offset = this.flag*this.limit;
    if (this.isReviwer == true)
    {
      this.status = 'submitted';
      this.filters = '?offset='+this.offset+'&limit='+this.limit+'&status='+this.status+'&fields=*.*';
    }

    if (this.isCreator == true)
    {
     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
     this.filters = '?filter[owner][eq]='+currentUser.data.user.id+'&offset='+this.offset+'&limit='+this.limit+'&fields=*.*';

     if (this.statusFilter)
     {
      this.filters = this.filters+'&status='+this.statusFilter;
     }
    }

    this.CollectionService.getItems('submission',this.filters).subscribe(result =>
      {
        this.submissionList = [];
        result.data.forEach(result=>{
        result.challenge_name = result.challenge_category.title;
        result.topic = result.challenge.title;
        result.owner_name = result.owner.first_name + " " + result.owner.last_name;
        this.submissionList.push(result);
        this.getSubmissionFiles(result.id);
        this.getReview(result.id);
      });
    });
  }  

  getSubmissionFiles(submissionId) {
    this.CollectionService.getItems('submission_directus_files', `?filter[submission_id][eq]=${submissionId}&fields=directus_files_id.*`).subscribe(data => {
    if(data.data[0].directus_files_id.type!='audio/mp3' && data.data[0].directus_files_id.type!='video/mp4')
    {
      this.submissionFiles[submissionId]=data.data[0].directus_files_id.data.thumbnails[3].url; 
    }
    }); 
  }

  getStatus() 
  {
    this.CollectionService.getField('submission', 'status').subscribe(result => {

      if (result.data['options'] !== null)
      {
        if (result.data['options']['status_mapping'] != undefined)
        {
          let choiceArray = [];

          for (var choice in result.data['options']['status_mapping']) {
            if (choice != 'deleted' && choice != 'draft')
            {
              let choiceObj = {value: choice, label: result.data['options']['status_mapping'][choice].name};
              choiceArray.push(choiceObj);
            }
          }

          this.statusData = choiceArray;
        }
      }
    });
  }

  getReview(submissionId)
  {
    this.CollectionService.getItems('submission_review', `?filter[submission_id][eq]=${submissionId}`).subscribe(result => {
      result.data.forEach(result=>{

      if (result.status)
      {
        this.reviews[submissionId] = result.status;
      }

      });
    });
  }
}
