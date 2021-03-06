// references
//  https://github.com/commitizen/cz-jira-smart-commit
//  https://github.com/ngryman/cz-emoji

const inquirer = require('inquirer')

const emojiTypes = [
  {
    name: 'feature \tâ¨  A new feature',
    value: 'â¨ ',
  },
  {
    name: 'fix \t\tğ  A bug fix',
    value: 'ğ ',
  },
  {
    name: 'docs \t\tğ  Documentation change',
    value: 'ğ ',
  },
  {
    name: 'refactor \tğ¨  A code refactoring change',
    value: 'ğ¨ ',
  },
  {
    name: 'misc \t\tâ¡ï¸  Other changes',
    value: 'â¡ï¸ ',
  },
  {
    name: 'revert \tâ¶  Revert some changes',
    value: 'â¶ ',
  },
]

const gitBranch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim()
  .split('-')

const ticket = gitBranch.splice(0, 2).join('-')

const ticketName = gitBranch ? ticket : undefined

const prompter = (cz, commit) => {
  const commitAnswers = (answers) => {
    const issues = answers.issues.trim()

    commit([
      issues.length === 0 ? undefined : `${issues} :`,
      answers.type,
      answers.message,
    ].filter((x) => !!x).join(' '))
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: "Select the type of change you're committing:",
      choices: emojiTypes,
    },
    {
      type: 'input',
      name: 'message',
      message: 'GitHub commit message (required):\n',
      validate(input) {
        if (!input) {
          return 'empty commit message'
        }
        return true
      },
    },
    {
      type: 'input',
      name: 'issues',
      message: 'Ticket/Issue ID(s) (required):\n',
      default: ticketName,
      validate(input) {
        if (!input) {
          return 'Must specify issue IDs, otherwise, just use a normal commit message'
        }
        return true
      },
    },
  ]).then(commitAnswers)
}

module.exports = { prompter }
