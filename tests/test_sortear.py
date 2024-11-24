from app.services.sortear import *
import unittest

class TestSortearNomes(unittest.TestCase):
    def test_sorteio_nomes(self):
        arrNomes = ['adelson','helen','jefferson','clecio','lucas','gabriel','cleber','mariana','jair','luci']

        meuNome, nomesSortidos, data = sortearNomes(arrNomes)

        # verifica se de fato retornou duas listas e um dicionario
        self.assertIsInstance(meuNome, list)
        self.assertIsInstance(nomesSortidos, list)
        self.assertIsInstance(data, dict)

        # verifica se a lista possui o mesmo comprimento
        self.assertEqual(len(meuNome), len(nomesSortidos))

        # verifica se nenhum nome ocupa a mesma posicao em ambos lados
        for original, sorteado in zip(meuNome,nomesSortidos):
            self.assertNotEqual(original,sorteado)

if __name__ == '__main__':
    unittest.main()