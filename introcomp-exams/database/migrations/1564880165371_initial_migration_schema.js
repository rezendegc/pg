"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InitialMigrationSchema extends Schema {
  async up() {
    await this.create("events", table => {
      table.increments();
      table.datetime("start_date").notNullable();
      table.datetime("end_date").notNullable();
      table.string("name").notNullable();
      table.timestamps();
    });
    await this.create("exam_schedules", table => {
      table.increments();
      table.datetime("start_datetime").notNullable();
      table.datetime("end_datetime").notNullable();
      table.time("register_time").notNullable();
      table
        .integer("event_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("events");
      table.timestamps();
    });
    await this.create("users", table => {
      table.increments();
      table.string("email", 254).notNullable();
      table.string("password", 60);
      table.string("school");
      table.string("cpf");
      table.string("name");
      table
        .enu("role", ["TEACHER", "ADMIN", "STUDENT"], {
          enumName: "UserRoles"
        })
        .defaultTo("STUDENT");
      table
        .enu("shift", ["MORNING", "VESPERTINE", "BOTH"], {
          enumName: "StudentShifts"
        })
        .notNullable();
      table
        .integer("event_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("events");
      table.timestamps();
    });
    await this.create("exams", table => {
      table.increments();
      table.integer("grade");
      table
        .integer("exam_schedule_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("exam_schedules");
      table
        .integer("event_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("events");
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users");
      table.timestamps();
    });
    await this.create("questions", table => {
      table.increments();
      table.text("summary");
      table.integer("difficulty").notNullable();
      table.bool("is_image").defaultTo(false);
      table.text("wording").notNullable();
      table.string("correct_answer").notNullable();
      table.text("answer_1").notNullable();
      table.text("answer_2").notNullable();
      table.text("answer_3").notNullable();
      table.text("answer_4").notNullable();
      table.text("answer_5").notNullable();
      table.timestamps();
    });
    await this.create("exam_question", table => {
      table.increments();
      table.string("answer");
      table
        .integer("exam_id")
        .unsigned()
        .references("id")
        .inTable("exams")
        .notNullable();
      table
        .integer("question_id")
        .unsigned()
        .references("id")
        .inTable("questions")
        .notNullable();
    });
  }

  async down() {
    await this.drop("exam_question");
    await this.drop("questions");
    await this.drop("exams");
    await this.drop("users");
    await this.drop("exam_schedules");
    await this.drop("events");
  }
}

module.exports = InitialMigrationSchema;
