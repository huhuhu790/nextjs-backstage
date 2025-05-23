export interface BasicMessage {
    userId: string
    title: string
    content: string
    isRead: boolean
    type: 'info' | 'warning' | 'error',
    sendBy: string
}

export interface Message extends BasicMessage {}
