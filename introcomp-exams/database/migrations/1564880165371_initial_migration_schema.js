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
      table.text('rules').notNullable();
      table.integer("amount_easy").defaultTo(5).notNullable();
      table.integer("amount_medium").defaultTo(5).notNullable();
      table.integer("amount_hard").defaultTo(4).notNullable();
      table.integer("amount_special").defaultTo(1).notNullable();
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
        .inTable("events")
        .onDelete('cascade');
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
      table.string("shift")
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("events")
        .onDelete('cascade');
      table.timestamps();
    });
    await this.create("exams", table => {
      table.increments();
      table.string("grade");
      table
        .integer("exam_schedule_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("exam_schedules")
        .onDelete('cascade');
        table
        .integer("event_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("events")
        .onDelete('cascade');
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete('cascade');
      table
        .enu("status", ["WAITING", "DOING", "FINISHED"], {
          enumName: "UserRoles"
        })
        .defaultTo("WAITING")
        .notNullable();
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
      table.bool("deleted").defaultTo(false);
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
        .onDelete('cascade')
        .notNullable();
      table
        .integer("question_id")
        .unsigned()
        .references("id")
        .inTable("questions")
        .onDelete('cascade')
        .notNullable();
      table.timestamps();
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
