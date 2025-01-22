import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()

document.addEventListener('DOMContentLoaded', () => {
  const activityArray = JSON.parse(localStorage.getItem('activities')) || []
  showTasks(activityArray)
})

const addTask = (e) => {
  e.preventDefault()

  const activityArray = JSON.parse(localStorage.getItem('activities')) || []

  const activityName = document.querySelector('#activityName').value.trim()
  const activityCategory = document.querySelector('#activityCategory').value

  activityArray.push({
    activity: activityName,
    category: activityCategory,
    done: false,
  })

  localStorage.setItem('activities', JSON.stringify(activityArray))

  document.getElementById('activityName').value = ''

  showTasks(activityArray)
}

const showTasks = (activityArray) => {
  const bucketLists = document.getElementById('bucketLists')
  bucketLists.textContent = ''

  const groupedActivities = activityArray.reduce(
    (acc, { activity, category, done }) => {
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push({ activity, done })
      return acc
    },
    {}
  )

  for (const category in groupedActivities) {
    const categoryContainer = document.createElement('div')
    categoryContainer.id = `category-container-${category}`
    categoryContainer.classList.add('category')

    const categoryTitle = document.createElement('h2')
    categoryTitle.textContent = capitalizeCategory(category)

    const categoryList = document.createElement('ul')
    categoryList.id = `list-${category}`

    const sortButton = document.createElement('button')
    sortButton.id = `sort-button-${category}`
    sortButton.classList.add('sort-button')
    sortButton.textContent = 'Sort A-Z'
    sortButton.addEventListener('click', () => {
      sortActivities(category, groupedActivities)
    })

    groupedActivities[category].forEach(({ activity, done }) => {
      const listItem = document.createElement('li')

      const taskDesc = document.createElement('span')
      taskDesc.classList.add('task-desc')
      taskDesc.textContent = activity

      const btnDone = document.createElement('button')
      btnDone.textContent = '✅'
      btnDone.classList.add('btn-done')
      btnDone.addEventListener('click', () => {
        switch (category) {
          case 'travel':
            jsConfetti.addConfetti({ emojis: ['✈️'] })
            break
          case 'adventure':
            jsConfetti.addConfetti({ emojis: ['🏝️'] })
            break
          case 'learning':
            jsConfetti.addConfetti({ emojis: ['🎓'] })
            break
          case 'hobby':
            jsConfetti.addConfetti({ emojis: ['🎸'] })
            break
          default:
            jsConfetti.addConfetti()
        }

        handleTaskDone(activity)
      })

      const btnEdit = document.createElement('button')
      btnEdit.textContent = '✏️'
      btnEdit.classList.add('btn-edit')
      btnEdit.addEventListener('click', () => {
        editActivity(activity)
      })

      if (done) {
        taskDesc.classList.add('task-completed')
        btnDone.disabled = true
        btnEdit.disabled = true
      }

      const btnDelete = document.createElement('button')
      btnDelete.textContent = '❌'
      btnDelete.classList.add('btn-delete')
      btnDelete.addEventListener('click', () => {
        deleteActivity(activity, category)
      })

      listItem.appendChild(taskDesc)
      listItem.appendChild(btnDone)
      listItem.appendChild(btnDelete)
      listItem.appendChild(btnEdit)
      categoryList.appendChild(listItem)
    })

    categoryContainer.appendChild(categoryTitle)
    categoryContainer.appendChild(sortButton)
    categoryContainer.appendChild(categoryList)
    bucketLists.appendChild(categoryContainer)
  }
}

const form = document.querySelector('#bucketForm')

form.addEventListener('submit', (e) => {
  addTask(e)
})

const capitalizeCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const deleteActivity = (activityName) => {
  let activityArray = JSON.parse(localStorage.getItem('activities')) || []

  const index = activityArray.findIndex(
    (item) => item.activity === activityName
  )
  activityArray.splice(index, 1)

  localStorage.setItem('activities', JSON.stringify(activityArray))

  showTasks(activityArray)
}

const handleTaskDone = (activityName) => {
  const activityArray = JSON.parse(localStorage.getItem('activities')) || []
  const completedActivity = activityArray.find(
    (item) => item.activity === activityName
  )

  if (completedActivity) {
    completedActivity.done = true
  }

  localStorage.setItem('activities', JSON.stringify(activityArray))
  showTasks(activityArray)
}

const editActivity = (activity) => {
  const activityArray = JSON.parse(localStorage.getItem('activities')) || []
  const activityToEdit = activityArray.find(
    (item) => item.activity === activity
  )

  const dialog = document.querySelector('dialog')
  dialog.showModal()

  const dialogText = document.querySelector('#dialog-desc')
  dialogText.textContent = `Edit activity "${activity}"?`

  const cancelButton = document.querySelector('#dialog-cancel')
  cancelButton.addEventListener('click', () => {
    dialog.close()
  })

  const editedActivity = document.querySelector('#dialog-edit')

  const editButton = document.querySelector('#dialog-ok')
  editButton.addEventListener('click', () => {
    activityToEdit.activity = editedActivity.value
    localStorage.setItem('activities', JSON.stringify(activityArray))
    editedActivity.textContent = ''
    dialog.close()
    showTasks(activityArray)
  })
}

const sortActivities = (category, groupedActivities) => {
  const sortedActivities = [...groupedActivities[category]].sort((a, b) => {
    return a.activity.localeCompare(b.activity)
  })

  groupedActivities[category] = sortedActivities

  const updatedActivities = Object.entries(groupedActivities).flatMap(
    ([key, activities]) => {
      return activities.map(({ activity, done }) => ({
        activity,
        category: key,
        done,
      }))
    }
  )

  localStorage.setItem('activities', JSON.stringify(updatedActivities))
  showTasks(updatedActivities)
}
