
/* eslint-disable indent */
{
    const select = {
        dom: {
            booksList: '.books-list',
            bookImages: '.books-list .book__image',
            filtersForm: '.filters'
        },

        templateOf: {
            booksList: '#template-book'
        }

    };

    const templates = {
        bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.booksList).innerHTML)
    };

    const classNames = {
        booksList: 'books-list',
        booksImages: 'book__image'
    };

    class BookList {

        constructor() {
            const thisBooksList = this;
            thisBooksList.initData();
            thisBooksList.render(thisBooksList);
            thisBooksList.initActions();
        }

        initData() {
            this.data = dataSource.books;
        }

        render(source) {
            const thisBook = this;

            for (let book of source.data) {
                book.ratingBgc = thisBook.determineRatingBgc(book.rating);
                book.ratingWidth = Math.floor(book.rating / 10 * 100);
                const generatedHTML = templates.bookTemplate(book);
                thisBook.element = utils.createDOMFromHTML(generatedHTML);
                document.querySelector(select.dom.booksList).appendChild(thisBook.element);
            }
        }

        initActions() {
            const thisApp = this;
            thisApp.favoriteBooks = [];
            thisApp.filters = [];
            document.querySelector(select.dom.booksList)
                .addEventListener('dblclick', (event) => {
                    event.preventDefault();
                    const parentElement = event.target.offsetParent;

                    if (parentElement.classList.contains(classNames.booksImages)) {
                        let id = event.target.offsetParent.getAttribute('data-id');
                        if (thisApp.favoriteBooks.includes(id)) {
                            thisApp.favoriteBooks = thisApp.favoriteBooks.filter(x => x !== id);
                            parentElement.classList.remove('favorite');
                        } else {
                            thisApp.favoriteBooks.push(id);
                            parentElement.classList.add('favorite');
                        }
                    }

                });
            document.querySelector(select.dom.filtersForm)
                .addEventListener('click', (event) => {
                    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
                        if (event.target.checked) {
                            thisApp.filters.push(event.target.value);
                        } else {
                            thisApp.filters = thisApp.filters.filter(x => x !== event.target.value);
                        }
                        thisApp.filterBooks();

                    }
                });
        }

        filterBooks() {
            const thisApp = this;
            for (let book of dataSource.books) {
                let shouldBeHidden = false;

                for (let currFilter of thisApp.filters) {
                    if (!book.details[currFilter]) {
                        shouldBeHidden = true;
                        break;
                    }
                }

                if (shouldBeHidden) {
                    document.querySelector(`.book__image[data-id="${book.id}"]`
                    ).classList.add('hidden');
                } else {
                    document.querySelector(`.book__image[data-id="${book.id}"]`
                    ).classList.remove('hidden');
                }
            }


        }

        determineRatingBgc(rating) {
            if (rating < 6) {
                return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
            } else if (rating > 6 && rating <= 8) {
                return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
            } else if (rating > 8 && rating <= 9) {
                return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';

            } else if (rating > 9) {
                return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
            }
        }


    }

    const app = new BookList();
    app();

}