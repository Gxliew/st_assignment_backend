/* eslint-disable prettier/prettier */
/* eslint-disable @adonisjs/prefer-lazy-controller-import */
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import FilesController from '#controllers/files_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.group(() => {
  router.post('/upload', [FilesController, 'upload'])
  router.post('/read', [FilesController, 'readFile'])
}).prefix('api/v1')
