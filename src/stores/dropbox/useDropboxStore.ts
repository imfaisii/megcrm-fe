import { useToast } from '@/plugins/toastr'
import { useAuthStore } from '@/stores/auth/useAuthStore'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useLeadsStore } from '../leads/useLeadsStore'

export const useDropboxStore = defineStore('dropbox', () => {

  const $toast = useToast()
  const loading = ref(false)

  const auth: any = useAuthStore();
  const leadsStore: any = useLeadsStore();
  const folder = `${leadsStore.selectedLead.post_code
    .toUpperCase()
    .replace(/ /g, "")} - ${leadsStore.selectedLead.address}`;

  const baseUrl = 'https://api.dropboxapi.com/2/files'
  const baseDirectory = '/001 Umar Riaz Ashton/~~~~##########ECO 4 SURVEY'

  const fileUploadEndpoint = "https://content.dropboxapi.com/2/files/upload";
  const newFolderEndpoint = `${baseUrl}/create_folder_v2`
  const folderFilesEndpoint = `${baseUrl}/list_folder`
  const getTemporaryLinkEndpoint = `${baseUrl}/get_temporary_link`

  const folderImages: any = ref([])
  const precheckingDocuments: any = ref([])

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth.user.dropbox.data}`
  }

  const index = async (folderName: string, fetchLinks: boolean = true) => {
    try {
      loading.value = true

      const { data } = await axios.post(`${folderFilesEndpoint}`, {
        "include_deleted": false,
        "include_has_explicit_shared_members": false,
        "include_media_info": true,
        "include_mounted_folders": true,
        "include_non_downloadable_files": true,
        "limit": 2000,
        "path": `${baseDirectory}/${folderName}/Survey`,
        "recursive": false
      }, {
        headers
      })

      folderImages.value = data.entries

      if (fetchLinks) {
        getTemporaryLinks(folderImages)
      }
    } catch (e: any) {
      console.log("DROPBOX:index => ", e.message);
    } finally {
      loading.value = false
    }
  }

  const getPreCheckingFiles = async (folderName: string, fetchLinks: boolean = true) => {
    try {
      loading.value = true

      const { data } = await axios.post(`${folderFilesEndpoint}`, {
        "include_deleted": false,
        "include_has_explicit_shared_members": false,
        "include_media_info": true,
        "include_mounted_folders": true,
        "include_non_downloadable_files": true,
        "limit": 2000,
        "path": `${baseDirectory}/${folderName}/Pre Checking`,
        "recursive": false
      }, {
        headers
      })

      precheckingDocuments.value = data.entries

      if (fetchLinks) {
        getTemporaryLinks(precheckingDocuments)
      }
    } catch (e: any) {
      console.log("DROPBOX:index => ", e.message);
    } finally {
      loading.value = false
    }
  }

  const create = async (newFolderName: string) => {
    try {
      loading.value = true;

      await axios.post(`${newFolderEndpoint}`, {
        autorename: false,
        path: `${baseDirectory}/${newFolderName}`
      }, {
        headers
      })

      $toast.success(`Folder with name ${newFolderName} was created.`)

    } catch (e: any) {
      console.log("DROPBOX:create => ", e.message);
    } finally {
      loading.value = false;
    }
  }

  const store = async (address: string, subFolder: string, file: any) => {
    try {
      loading.value = true;

      const headers = {
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": JSON.stringify({
          autorename: true,
          mode: "add",
          mute: false,
          path: `${baseDirectory}/${address}/${subFolder}/${file.name}`,
          strict_conflict: true,
        }),
        Authorization: `Bearer ${auth.user.dropbox.data}`,
      };

      await axios.post(fileUploadEndpoint, file, { headers });
    } catch (e: any) {
      console.log("DROPBOX:store => ", e.message);
      throw Error(e?.message)
    } finally {
      loading.value = false;
    }
  }

  const getTemporaryLinks = async (ref: Ref) => {
    try {
      ref.value.forEach(async (e: any) => {
        if (!e.link) {
          const { data } = await axios.post(`${getTemporaryLinkEndpoint}`, {
            path: `${e.path_display}`
          }, {
            headers
          })

          e.link = data.link
        }
      });

    } catch (e: any) {
      console.log("DROPBOX:create => ", e.message);
    }
  }


  return {
    loading,
    folderImages,
    folder,
    precheckingDocuments,

    getPreCheckingFiles,
    create,
    index,
    store,
  }
})
