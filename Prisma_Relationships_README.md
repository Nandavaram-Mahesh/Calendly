# Prisma Relationships Guide

## One-to-One (1:1)

A user has exactly one profile, and a profile belongs to exactly one user.

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  bio    String?
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique
}
```

### Key Point
`userId` is marked with `@unique`, ensuring a one-to-one relationship.

---

## One-to-Many (1:N)

A user can have many posts, but each post belongs to one user.

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique

  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String

  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

### Key Point
The foreign key (`authorId`) lives on the "many" side (`Post`).

---

## Many-to-Many (N:N)

### Implicit Many-to-Many

```prisma
model Student {
  id      Int      @id @default(autoincrement())
  name    String

  courses Course[]
}

model Course {
  id       Int       @id @default(autoincrement())
  title    String

  students Student[]
}
```

### Key Point
Prisma automatically creates the join table.

---

## Explicit Many-to-Many

Use this when you need extra fields on the relationship.

```prisma
model Student {
  id          Int          @id @default(autoincrement())
  name        String

  enrollments Enrollment[]
}

model Course {
  id          Int          @id @default(autoincrement())
  title       String

  enrollments Enrollment[]
}

model Enrollment {
  student   Student @relation(fields: [studentId], references: [id])
  studentId Int

  course    Course  @relation(fields: [courseId], references: [id])
  courseId  Int

  enrolledAt DateTime @default(now())

  @@id([studentId, courseId])
}
```

### Key Point
The `Enrollment` table acts as a junction table and can store additional data such as `enrolledAt`.

---

## Quick Reference

| Relation Type | Foreign Key Location |
|---------------|---------------------|
| One-to-One | On one side, marked `@unique` |
| One-to-Many | On the "many" side |
| Many-to-Many | Join table (implicit or explicit) |
