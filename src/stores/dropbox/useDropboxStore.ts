import env from '@/constants/env'
import { useToast } from '@/plugins/toastr'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useDropboxStore = defineStore('dropbox', () => {

  const $toast = useToast()

  const baseUrl = 'https://api.dropboxapi.com/2/files'
  const baseDirectory = '/001 Umar Riaz Ashton/~~~~##########ECO 4 SURVEY'

  const fileUploadEndpoint = "https://content.dropboxapi.com/2/files/upload";
  const newFolderEndpoint = `${baseUrl}/create_folder_v2`
  const folderFilesEndpoint = `${baseUrl}/list_folder`
  const getTemporaryLinkEndpoint = `${baseUrl}/get_temporary_link`

  const folderImages = ref([])

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.VITE_APP_DROPBOX_TOKEN}`
  }

  const index = async (folderName: string) => {
    try {
      const { data } = await axios.post(`${folderFilesEndpoint}`, {
        "include_deleted": false,
        "include_has_explicit_shared_members": false,
        "include_media_info": true,
        "include_mounted_folders": true,
        "include_non_downloadable_files": true,
        "limit": 2000,
        "path": `${baseDirectory}/${folderName}`,
        "recursive": false
      }, {
        headers
      })

      folderImages.value = data.entries
      getTemporaryLinks()
    } catch (e: any) {
      console.log("DROPBOX:index => ", e.message);
    }
  }

  const create = async (newFolderName: string) => {
    try {
      await axios.post(`${newFolderEndpoint}`, {
        autorename: false,
        path: `${baseDirectory}/${newFolderName}`
      }, {
        headers
      })

      $toast.success(`Folder with name ${newFolderName} was created.`)

    } catch (e: any) {
      console.log("DROPBOX:create => ", e.message);
    }
  }

  const store = async (address: string, file: any) => {
    const headers = {
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({
        autorename: true,
        mode: "add",
        mute: false,
        path: `${baseDirectory}/${address}/${file.name}`,
        strict_conflict: false,
      }),
      Authorization: `Bearer ${env.VITE_APP_DROPBOX_TOKEN}`,
    };

    try {
      await axios.post(fileUploadEndpoint, file, { headers });
    } catch (e: any) {
      console.log("DROPBOX:store => ", e.message);
    }
  }

  const getTemporaryLinks = async () => {
    try {
      folderImages.value.forEach(async (e: any) => {
        const { data } = await axios.post(`${getTemporaryLinkEndpoint}`, {
          path: `${e.path_display}`
        }, {
          headers
        })

        e.link = data.link
      });

    } catch (e: any) {
      console.log("DROPBOX:create => ", e.message);
    }
  }


  return {
    folderImages,

    create,
    index,
    store,
  }
})
