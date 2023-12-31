'use client'
import { format } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

const HOURS_IN_MILLISECONDS = 16 * 60 * 60 * 1000

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [litersLeft, setLitersLeft] = useState(0)
  const [intervalTime, setIntervalTime] = useState(0)
  const interval = useMemo(() => {
    if (litersLeft)
      return setTimeout(() => {
        const notification = new Notification("Water tracker", { body: 'Hora de beber água' })

        setTimeout(() => notification.close(), 2500)
      }, intervalTime)

    return setTimeout(() => { }, 1)
  }, [intervalTime, litersLeft])


  useEffect(() => {
    if (Notification.permission !== 'granted')
      Notification.requestPermission()

    const stringfyedUser = localStorage.getItem('user')
    if (stringfyedUser) {
      const savedUser = JSON.parse(stringfyedUser)
      const litersPerDay = JSON.parse(localStorage.getItem('litersPerDay')!)
      setUser(savedUser)
      if (litersPerDay.date === format(new Date(), 'dd/MM/yyyy')) {
        setLitersLeft(litersPerDay.litersLeft)
        setIntervalTime(Math.round(HOURS_IN_MILLISECONDS / (litersPerDay.litersLeft / 250)))
      } else {
        setLitersLeft(savedUser.weight * 35)
        setIntervalTime(Math.round(HOURS_IN_MILLISECONDS / ((savedUser.weight * 35) / 250)))
      }
    }

    return () => {
      clearTimeout(interval)
    }
  }, [])

  function handleSubmit(e: any) {
    e.preventDefault()

    const newUser = {
      name: e.target.name.value,
      weight: Number(e.target.weight.value)
    }

    localStorage.setItem('user', JSON.stringify(newUser))
    localStorage.setItem('litersPerDay', JSON.stringify({
      litersLeft: newUser.weight * 35,
      date: format(new Date(), 'dd/MM/yyyy')
    }))
    setUser(newUser)
    setLitersLeft(newUser.weight * 35)
    setIntervalTime(Math.round(HOURS_IN_MILLISECONDS / ((newUser.weight * 35) / 250)))
  }


  function addLiters(e: any) {
    e.preventDefault()

    const litersDiff = litersLeft - Number(e.target.liters.value)
    if (litersDiff <= 0) {
      localStorage.setItem('litersPerDay', JSON.stringify({
        litersLeft: 0,
        date: format(new Date(), 'dd/MM/yyyy')
      }))
      setLitersLeft(0)
    } else {
      localStorage.setItem('litersPerDay', JSON.stringify({
        litersLeft: litersDiff,
        date: format(new Date(), 'dd/MM/yyyy')
      }))
      setLitersLeft(litersDiff)
    }
    e.target.liters.value = ''
  }



  function removeUserData() {
    localStorage.clear()

    setUser(null)
    setLitersLeft(0)
    setIntervalTime(0)
  }

  return (
    <main className='h-screen w-full flex justify-center items-center'>
      {user ?
        <div
          className='flex flex-col gap-5 bg-zinc-700 p-8 rounded-md'
        >
          <h2
            className='text-slate-200 text-xl font-semibold'
          >{user.name}</h2>
          {litersLeft ?
            <>
              <p className='text-slate-200'>
                Faltam <span className='font-bold'>{litersLeft}ml</span> para você hoje.
              </p>
              <form
                className='flex flex-col gap-5 bg-zinc-700 rounded-md'
                onSubmit={addLiters}
              >
                <input
                  className='p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring'
                  name='liters'
                  type='number'
                />
                <button
                  className='p-4 bg-green-400 rounded-lg hover:bg-green-600 transition duration-150 ease-in'
                  type='submit'
                >
                  Salvar ml
                </button>
                <button
                  className='p-4 bg-red-400 rounded-lg hover:bg-green-600 transition duration-150 ease-in'
                  type='button'
                  onClick={removeUserData}
                >
                  Alterar dados do usuário
                </button>
              </form>
            </>
            :
            <>
              <h1>Parabéns {user.name} você atingiu seu objetivo!</h1>
            </>
          }
        </div>
        :
        <form
          className='flex flex-col gap-5 bg-zinc-700 p-8 rounded-md'
          onSubmit={handleSubmit}>
          <input
            className='p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring'
            name='name'
            placeholder='Nome'
          />
          <input
            className='p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring'
            name='weight'
            type='number'
            placeholder='Peso'
          />
          <button
            className='p-4 bg-green-400 rounded-lg hover:bg-green-600 transition duration-150 ease-in'
            type='submit'
          >
            Salvar Usuário
          </button>
        </form>
      }
    </main>
  )
}
