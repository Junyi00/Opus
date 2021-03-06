# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

users = User.create!([
    {
        username: "develop",
        password_digest: BCrypt::Password.create("develop"),
        email: "dev@dev.com"
    },
    {
        username: "develop1",
        password_digest: BCrypt::Password.create("develop"),
        email: "dev1@dev.com"
    }
])

projects = Project.create!([
    {
        name: "Study",
        user: users.first
    },
    {
        name: "Study",
        user: User.find_or_create_by(username: 'develop1')
    }
])

lanes = Lane.create!([
    {
        name: "New",
        project: projects.first,
        pos: 0
    },
    {
        name: "In Progress",
        project: projects.first,
        pos: 1
    },
    {
        name: "Completed",
        project: projects.first,
        pos: 2
    }
])

tasks = Task.create!([
    {
        name: "Draw Mindmap",
        description: "MODULE 1",
        starred: false,
        pos: 0,
        completed: false,
        duedate: DateTime.new(2021,12,31),
        lane: Lane.find_or_create_by(name: "New")
    },
    {
        name: "Cheatsheet",
        description: "MODULE 1",
        starred: true,
        pos: 0,
        completed: false,
        duedate: DateTime.new(2021,12,31),
        lane: Lane.find_or_create_by(name: "In Progress")
    },
    {
        name: "Another Cheatsheet",
        description: "MODULE 1",
        starred: false,
        pos: 1,
        completed: false,
        duedate: DateTime.new(2022,1,5),
        lane: Lane.find_or_create_by(name: "In Progress")
    },
    {
        name: "PYP",
        description: "MODULE 1",
        starred: true,
        pos: 0,
        completed: false,
        duedate: nil,
        lane: Lane.find_or_create_by(name: "Completed")
    }
])

tags = Tag.create!([
    {
        name: "Exam",
        color: "#a9d18e",
        task: Task.find_or_create_by(name: "PYP")
    },
    {
        name: "Notes",
        color: "#ffd966",
        task: Task.find_or_create_by(name: "Draw Mindmap")
    }
])