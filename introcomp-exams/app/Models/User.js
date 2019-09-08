"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Hash = use("Hash");

class User extends Model {
  static boot() {
    super.boot();

    //this is what hash password before saving it
    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  exam() {
    return this.hasOne("App/Models/Exam");
  }

  event() {
    return this.belongsTo("App/Models/Event");
  }
}

module.exports = User;
