# Статистика

observer = Tools.observer
getValScope = Tools.getValScope

class Statistic
  constructor: (@players) ->
    @stats =
      "all_damage":
        "title": "Урона нанесено: "
        "value": 0

      "all_tasks":
        "title": "Сыгранные задачи: "
        "value": 0

      "all_treat":
        "title": "Вылеченно здоровья: "
        "value": 0

      "solve_percent":
        "title": "Решённые/все задачи: "
        "value": 0

  binds: ->
    @_bind_damage()

  _bind_damage: ->
    for id, player of @players
      if "length" != id

        observer.observe(player, "health", (type, oldValue, newValue) =>
          dmg = getValScope oldValue - newValue, [0, +Infinity]
          @stats.all_damage.value += dmg
        )

window.Model.Statistic = Statistic