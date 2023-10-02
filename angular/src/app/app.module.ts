import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntryPageComponent } from './entry-page/entry-page.component';
import { NavigationComponent } from './entry-page/navigation/navigation.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { HomeComponent } from './entry-page/home/home.component';
import { BooksComponent } from './reader-interface/books/books.component';
import { ReaderInterfaceComponent } from './reader-interface/reader-interface.component';
import { ModeratorInterfaceComponent } from './moderator-interface/moderator-interface.component';
import { RouterModule } from '@angular/router';
import { AuthorsComponent } from './reader-interface/authors/authors.component';
import { GenresComponent } from './reader-interface/genres/genres.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GenreDetailComponent } from './reader-interface/genre-detail/genre-detail.component';
import { AuthorDetailComponent } from './reader-interface/author-detail/author-detail.component';
import { BookDetailComponent } from './reader-interface/book-detail/book-detail.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { signinReducer } from './store/reducers/signin.reducers';
import { signupReducer } from './store/reducers/signup.reducers';
import { ProfileComponent as ModeratorProfile } from './moderator-interface/profile/profile.component';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { BookEffects } from './store/effects/book.effects';
import { bookReducer } from './store/reducers/book.reducers';
import AppState from './app.state';
import { userChangePasswordReducer } from './store/reducers/user.reducers';
import { reviewDataReducer, reviewReducer } from './store/reducers/review.reducers';
import { ReviewEffect } from './store/effects/review.effects';
import { BooksComponent as ModeratorBooks } from './moderator-interface/books/books.component';
import { NavMenuComponent } from './moderator-interface/nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    ModeratorInterfaceComponent,
    GenreDetailComponent,
    ModeratorProfile,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EntryPageComponent,
    NavigationComponent,
    AppRoutingModule,
    ReaderInterfaceComponent,
    HomeComponent,
    BooksComponent,
    RouterModule,
    HttpClientModule,
    GenresComponent,
    AuthorsComponent,
    BookDetailComponent,
    AuthorDetailComponent,
    ModeratorBooks,
    NavMenuComponent,

    StoreModule.forRoot<AppState>({
      books: bookReducer,
      userSigninCredentials: signinReducer,
      userSignupCredentials: signupReducer,
      updatePasswordData: userChangePasswordReducer,
      review: reviewReducer,
      addReviewData: reviewDataReducer
    }),
    EffectsModule.forRoot([BookEffects, ReviewEffect]),
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export default class AppModule { }
