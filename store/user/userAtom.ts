import { LocalUser } from '@/types/api'
import { atom } from 'jotai'

const userInfoAtom = atom<LocalUser | null>(null)

export { userInfoAtom }