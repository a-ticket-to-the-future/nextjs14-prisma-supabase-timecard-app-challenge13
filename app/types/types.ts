export interface User {
    id: string | null ,
    name: string | null,
    email: string | null, 
    hashedPassword: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
} 


export interface Timecard {
    id: string | null,
    userId: string | null,
    startedAt: Date | null,
    endedAt: Date | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    subTotal: string | null,
    total: Date | null
}


// id          Int     @id @default(autoincrement())
//   userId      Int
//   startedAt   DateTime
//   endedAt     DateTime
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt