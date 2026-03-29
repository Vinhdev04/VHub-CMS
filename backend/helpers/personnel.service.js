import {
  findAllPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
} from '../helpers/personnel.repository.js';

export async function getPersonnelList() {
  return findAllPersonnel();
}

export async function createPersonnelItem(payload) {
  return createPersonnel(payload);
}

export async function updatePersonnelItem(personId, payload) {
  return updatePersonnel(personId, payload);
}

export async function deletePersonnelItem(personId) {
  return deletePersonnel(personId);
}
