import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../entry-page/home/home.component';
import { NavigationComponent } from '../entry-page/navigation/navigation.component';
import { Signin } from '../entry-page/signin/signin.component';
import { Signup } from '../entry-page/signup/signup.component';
import { ReaderInterfaceComponent } from '../reader-interface/reader-interface.component';
import { BooksComponent } from '../reader-interface/books/books.component';
import { ProfileComponent } from '../reader-interface/profile/profile.component';
import { AuthorsComponent } from '../reader-interface/authors/authors.component';
import { GenresComponent } from '../reader-interface/genres/genres.component';
import { AuthorDetailComponent } from '../reader-interface/author-detail/author-detail.component';
import { GenreDetailComponent } from '../reader-interface/genre-detail/genre-detail.component';
import { BookDetailComponent } from '../reader-interface/book-detail/book-detail.component';
import { AuthGuard } from 'src/guards';
import { RolesGuard } from 'src/guards/roles.guard';
import { ModeratorInterfaceComponent } from '../moderator-interface/moderator-interface.component';
import { ProfileComponent as ModeratorProfile } from '../moderator-interface/profile/profile.component';
import { BooksComponent as ModeratorBooks } from '../moderator-interface/books/books.component';
const routes: Routes = [
    //
    { path: "", component: HomeComponent },
    { path: "signin", component: Signin },
    { path: "signup", component: Signup },

    // 
    {
        path: "r", component: ReaderInterfaceComponent,
        canActivate: [AuthGuard, RolesGuard],
        children: [
            { path: "books", component: BooksComponent },
            { path: "books/:id", component: BookDetailComponent },
            { path: "authors", component: AuthorsComponent },
            { path: "authors/:id", component: AuthorDetailComponent },
            { path: "genres", component: GenresComponent },
            { path: "genres/:id", component: GenreDetailComponent },
            { path: "profile", component: ProfileComponent },
        ]
    },

    {
        path: "m", component: ModeratorInterfaceComponent,
        canActivate: [AuthGuard, RolesGuard],
        children: [
            { path: "profile", component: ModeratorProfile },
            { path: "books", component: ModeratorBooks }
        ]
    }

    // cisto cu mora napravim dve tri moderator rute da bih proverio
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}