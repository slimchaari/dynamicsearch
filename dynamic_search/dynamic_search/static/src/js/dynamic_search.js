/** @odoo-module **/

import { SearchBar } from "@web/search/search_bar/search_bar";
import { SearchModel } from "@web/search/search_model";
import { patch } from "@web/core/utils/patch";
import { useEffect } from "@odoo/owl";

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

patch(SearchBar.prototype, {
  setup() {
    super.setup();
      useEffect(
        (items) => {
          if (this.items.length > 0 && getParameterByName("model", window.location.href) === "product.product")
            this.selectItem(this.items[this.state.focusedIndex], false);
        },
        () => [this.items]
      );
  },

  onSearchInput(ev) {
    const query = ev.target.value;
    if (query.trim()) {
      this.computeState({
        query,
        expanded: [],
        focusedIndex: 0,
        subItems: [],
      });
      if (
        getParameterByName("model", window.location.href) === "product.product"
      )
        this.items = Object.assign([], this.items);
    } else if (this.items.length) {
      this.resetState();
    }
  },
  selectItem(item, enter = true) {
    const searchItem = this.getSearchItem(item.searchItemId);
    if (
      (searchItem.type === "field" && searchItem.fieldType === "properties") ||
      (searchItem.type === "field_property" && item.unselectable)
    ) {
      this.toggleItem(item, !item.isExpanded);
      return;
    }

    if (!item.unselectable) {
      const { searchItemId, label, operator, value } = item;
      this.env.searchModel.addAutoCompletionValues(searchItemId, {
        label,
        operator,
        value,
      });
    }
    if (enter) {
      this.resetState();
    }
  },
});
patch(SearchModel.prototype, {
  addAutoCompletionValues(searchItemId, autocompleteValue) {
    if (
      getParameterByName("model", window.location.href) === "product.product"
    ) {
      const searchItem = this.searchItems[searchItemId];
      if (!["field", "field_property"].includes(searchItem.type)) {
        return;
      }
      const { label, value, operator } = autocompleteValue;
      const queryElem = this.query.find(
        (queryElem) => queryElem.searchItemId === searchItemId
        // &&
        // "autocompleteValue" in queryElem &&
        // queryElem.autocompleteValue.value === value &&
        // queryElem.autocompleteValue.operator === operator
      );
      if (!queryElem) {
        this.query.push({ searchItemId, autocompleteValue });
      } else {
        queryElem.autocompleteValue.label = label; // seems related to old stuff --> should be useless now
      }
      this._notify();
    } else super.addAutoCompletionValues(searchItemId, autocompleteValue);
  },
});
