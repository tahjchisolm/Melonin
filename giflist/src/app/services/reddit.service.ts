import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedditService {

  public settings = {
    perPage: 10, 
    subreddit: 'gifs',
    sort: '/hot'
  };

  public posts: any[] = [];

  public loading: boolean = false;
  private page: number = 1;
  private after: string;
  private moreCount: number = 0;


  constructor(private http: HttpClient, private dataService: DataService) { }

  load(): void {
    this.dataService.getData().then(settings => {
      if (settings != null) {
        this.settings = settings;
      }

      this.fetchData();
    });
  }

  fetchData(): void {
    // build URL that will be used to access the API based on the users current preferences
    let url =
      "https://www.reddit.com/r/" +
      this.settings.subreddit +
      this.settings.sort +
      "/.json?limit=100";
    // only grab posts from API after last post retrieved
    if (this.after) {
      url += "&after=" + this.after;
    }

    this.loading = true;

    this.http
      .get(url)
      .pipe(
        // modify response to return data in more friendly format
        map((res: any) => {
          console.log(res);

          let response = res.data.children;
          let validPosts = 0;

          // remove any posts that dont provide a GIF in suitable format
          response = response.filter(post => {
            // if enough posts retrieved already, we don't want anymore
            if (validPosts >= this.settings.perPage) {
              return false;
            }
            // we only want to keep .gifv and .webm formats, and convert to mp4
            if (post.data.url.indexOf(".gifv") > -1 || post.data.url.indexOf(".webm") > -1) {
              post.data.url = post.data.url.replace(".gifv",".mp4");
              post.data.url = post.data.url.replace(".webm",".mp4");
              // if preview image available, assign it to post as snapshot
              if (typeof post.data.preview != "undefined") {
                post.data.snapshot = post.data.preview.images[0].source.url.replace(/&amp;/g,"&");
                // if snapshot undefined, change it to be blank
                if (post.data.snapshot == "undefined") {
                  post.data.snapshot = "";
                }
              } else {
                post.data.snapshot = "";
              }

              validPosts++;

              return true;
            } else {
              return false;
            }
          });
          // if we've had enough valid posts, set that as "after", otherwise just set last post
          if (validPosts >= this.settings.perPage) {
            this.after = response[this.settings.perPage - 1].data.name;
            console.log(this.after);
          }

          return response;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          
          // add new posts we just pulled in to the existing posts
          this.posts.push(...data);

          // keep fetching more GIFs if we didn't retrieve enough to fill page
          // but give up after 20 tries

          if (this.moreCount > 50) {
            console.log("giving up");

            // time to give up
            this.moreCount = 0;
            this.loading = false;
          } else {
            // if we don't have enough valid posts to fill a page, try fetching more data
            if (this.posts.length < this.settings.perPage * this.page) {
              this.fetchData();
              this.moreCount++;
            } else {
              this.loading = false;
              this.moreCount = 0;
            }
          }
        },
        err => {
          console.log(err);
          // fail silently, in this case the loading spinner will continue display
          console.log("can't find data!");
        }
      );
  }

  nextPage(): void{
    this.page++;
    this.fetchData();
  }

  resetPosts(): void{
    this.page = 1;
    this.posts = [];
    this.after = null;
    this.fetchData();
  }

  changeSubreddit(subreddit): void {
    this.settings.subreddit = subreddit;
    this.resetPosts();
  }

}
