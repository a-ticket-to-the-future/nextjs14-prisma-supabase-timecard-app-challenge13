export interface User {
    id: number,
    userName: String,
    email: String, 
    password: String,
    createdAt: Date,
    updatedAt: Date,
}


export interface Timecard {
    id: number,
    userId: String,
    startedAt: Date | null,
    endedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
}


// id          Int     @id @default(autoincrement())
//   userId      Int
//   startedAt   DateTime
//   endedAt     DateTime
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt