// useDataTable.js
import { removeEmptyAndNull } from '@/utils/useHelper';
import debounce from 'lodash.debounce';
import { watch } from 'vue';

type PiniaStore<T extends (...args: any) => any> = Omit<
  ReturnType<T>,
  keyof ReturnType<typeof defineStore>
>;

export default function useDataTable(store: PiniaStore<any>, filters: any, fetch: any) {

  const onPaginationChange = async ($event: any) => {
    store.meta.per_page = $event.pagination.per_page;
    store.meta.current_page = $event.pagination.current_page;
    store.meta.sort = $event.sort;

    await fetch();
  };

  const onSortChange = async ($event: any) => {
    store.meta.sort = $event.sort;

    await fetch();
  };

  const update = debounce(() => fetch(), 500)

  watch(
    filters,
    async (n) => {
      store.meta.filters = removeEmptyAndNull(n);

      await update();
    },
    { deep: true }
  );

  return {
    update,
    onSortChange,
    onPaginationChange
  }
}
