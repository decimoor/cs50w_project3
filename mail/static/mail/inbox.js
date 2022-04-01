

document.addEventListener('DOMContentLoaded', function() {
  window.onpopstate = event => {
    load_mailbox(event.state.section)
  }

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});
function compose_email() {
  // history.pushState({section: 'compose'}, "", '/compose')

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Collect form's fields and make request
  document.querySelector('#compose-form').onsubmit = () => {
    

    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value


    // starting making request
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result)
    })

    load_mailbox('inbox')

    return false
  }
}

function load_mailbox(mailbox) {
  // history.pushState({ section: mailbox}, "", `/${mailbox}`)

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      const emails_div = document.querySelector('#emails-view')
      emails.forEach(element => {
        console.log(element)
        const mini_view = document.createElement('div')
        mini_view.className = 'mini-view'
        // mini-view.innerHTML = `<div class=\"from-mv a-bit-padding\"><p>From: ${element.sender}</p></div><div class=\"separator\"></div><div class=\"subject-mv a-bit-padding\"><p>${element.subject}</p></div><div class=\"separator\"></div><div class=\"timestamp a-bit-padding\">${element.timestamp}</div>`
        mini_view.innerHTML = `<div class="from-mv a-bit-padding"><p>From: ${element.sender}</p></div><div class='separator'></div><div class='subject-mv a-bit-padding'><p>${element.subject}</p></div><div class='separator'></div><div class='timestamp a-bit-padding'>${element.timestamp}</div>`
        emails_div.append(mini_view)

        mini_view.addEventListener('click', function() {
          console.log('mini_view were clicked')
          emails_div.childNodes.forEach(function(email){
            if (email.className === 'mini-view'){
              
              if (email != mini_view){
                console.log(email.querySelector('.from-mv').querySelector('p').innerHTML)
                email.classList.add('hiding-animation')
                email.addEventListener('animationed', () => {
                email.remove()
                })
              }
            }
          })
        })
       
      });
    })
  }
