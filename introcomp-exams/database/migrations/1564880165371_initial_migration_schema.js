"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InitialMigrationSchema extends Schema {
  async up() {
    await this.create("exam_schedules", table => {
      table.increments();
      table.datetime("start_datetime");
      table.datetime("end_datetime");
      table.time("register_time");
      table.timestamps();
    });
    await this.create("events", table => {
      table.increments();
      table.datetime("start_date");
      table.datetime("end_date");
      table.string("name");
      table.timestamps();
    });
    await this.create("exams", table => {
      table.increments();
      table.integer("grade");
      table
        .integer("exam_schedule_id")
        .unsigned()
        .references("id")
        .inTable("exam_schedules");
      table.timestamps();
    });
    await this.create("users", table => {
      table.increments();
      table.string("email", 254).notNullable();
      table.string("password", 60);
      table.string("school");
      table.string("name");
      table.enu("role", ["TEACHER", "ADMIN", "STUDENT"], {
        enumName: "UserRoles"
      });
      table.enu("shfit", ["MORNING", "VESPERTINE", "BOTH"], {
        enumName: "StudentShifts"
      });
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("events");
      table
        .integer("exam_id")
        .unsigned()
        .references("id")
        .inTable("exams");
      table.timestamps();
    });
    await this.create("questions", table => {
      table.increments();
      table.string("summary");
      table.integer("difficulty");
      table.bool("is_image");
      table.string("correct_answer");
      table.string("answer_1");
      table.string("answer_2");
      table.string("answer_3");
      table.string("answer_4");
      table.string("answer_5");
      table.timestamps();
    });
    await this.create("exam_question", table => {
      table.increments();
      table.string("answer");
      table
        .integer("exam_id")
        .unsigned()
        .references("id")
        .inTable("exams");
      table
        .integer("question_id")
        .unsigned()
        .references("id")
        .inTable("questions");
      table.timestamps();
    });
  }

  async down() {
    await this.drop("exam_question");
    await this.drop("questions");
    await this.drop("users");
    await this.drop("exams");
    await this.drop("events");
    await this.drop("exam_schedules");
  }
}

module.exports = InitialMigrationSchema;
