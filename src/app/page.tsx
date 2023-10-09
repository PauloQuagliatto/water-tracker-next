'use client'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const hoursInMilliseconds = 16 * 60 * 60 * 1000

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [litersLeft, setLitersLeft] = useState(0)
  const [intervalTime, setIntervalTime] = useState(0)

  useEffect(() => {
    const stringfyedUser = localStorage.getItem('user')
    if (stringfyedUser) {
      const savedUser = JSON.parse(stringfyedUser)
      const litersPerDay = JSON.parse(localStorage.getItem('litersPerDay')!)
      setUser(savedUser)
      if (litersPerDay.date === format(new Date(), 'dd/MM/yyyy')) {
        setLitersLeft(litersPerDay.litersLeft)
        setIntervalTime(Math.round(hoursInMilliseconds / (litersPerDay.litersLeft / 250)))
      } else {
        setLitersLeft(savedUser.weight * 35)
        setIntervalTime(Math.round(hoursInMilliseconds / ((savedUser.weight * 35) / 250)))
      }
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
    setIntervalTime(Math.round(hoursInMilliseconds / ((newUser.weight * 35) / 250)))
  }


  function addLiters(e: any) {
    e.preventDefault()

    localStorage.setItem('litersPerDay', JSON.stringify({
      litersLeft: litersLeft - Number(e.target.liters.value),
      date: format(new Date(), 'dd/MM/yyyy')
    }))
    e.target.liters.value = ''
    setLitersLeft(prevState => prevState - Number(e.target.liters.value))
  }

  litersLeft && setInterval(() => {
    window.alert(`Beba pelo menos 250ml de água`)
  }, intervalTime)


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
