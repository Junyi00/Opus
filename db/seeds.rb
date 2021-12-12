# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

users = User.create([
    {
        username: "develop",
        password_digest: BCrypt::Password.create("develop"),
        email: "dev@dev.com"
    }
])

projects = Project.create([
    {
        name: "Study",
        user: users.first
    }
])

lanes = Lane.create([
    {
        name: "New",
        project: projects.first
    },
    {
        name: "In Progress",
        project: projects.first
    },
    {
        name: "Completed",
        project: projects.first
    }
])

tasks = Task.create([
    {
        name: "Draw Mindmap",
        description: "MODULE 1",
        starred: false,
        lane: Lane.find_or_create_by(name: "New")
    },
    {
        name: "Cheatsheet",
        description: "MODULE 1",
        starred: true,
        lane: Lane.find_or_create_by(name: "In Progress")
    },
    {
        name: "PYP",
        description: "MODULE 1",
        starred: true,
        lane: Lane.find_or_create_by(name: "Completed")
    }
])

tags = Tag.create([
    {
        name: "Exam",
        task: Task.find_or_create_by(name: "PYP")
    },
    {
        name: "Notes",
        task: Task.find_or_create_by(name: "Draw Mindmap")
    }
])