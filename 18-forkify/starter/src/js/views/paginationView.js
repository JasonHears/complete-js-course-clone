import View from './view.js';

import icons from 'url:../../img/icons.svg'; // Parcel 2 -- import icon file

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkupButton(currentPage, next = true) {
    return `
    <button data-goto="${
      currentPage + (next ? 1 : -1)
    }" class="btn--inline pagination__btn--${next ? 'next' : 'prev'}">
      ${next ? '<span>Page ' + (currentPage + 1) + '</span>' : ''}
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${next ? 'right' : 'left'}"></use>
      </svg>
      ${!next ? '<span>Page ' + (currentPage - 1) + '</span>' : ''}
    </button>
  `;
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;

    const pageLabel = `<span class="pagination__label">Showing page ${currentPage} of ${
      numPages + 1
    }</span>`;

    // Page 1 and other pages
    if (this._data.page === 1 && numPages > 1) {
      return this._generateMarkupButton(currentPage, true) + pageLabel;
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return pageLabel + this._generateMarkupButton(currentPage, false);
    }
    // Other page in middle
    if (currentPage < numPages) {
      return (
        this._generateMarkupButton(currentPage, false) +
        pageLabel +
        this._generateMarkupButton(currentPage, true)
      );
    }

    return '';
  }
}

export default new PaginationView();
