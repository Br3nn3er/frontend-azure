import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Icon,
  Table as ChackraTable,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Tooltip,
  Box,
  Flex,
} from '@chakra-ui/react';
import Router from 'next/router';
import { CSSProperties, FC, useCallback, useRef, useState } from 'react';
import { RiDeleteBin6Line, RiPencilLine } from 'react-icons/ri';

import { ModalConfirm } from '@components/ModalConfirm';
import { Params } from '@components/Pages/Curso/Editar/types';
import { Loader } from '@components/PageList/components/Loader';

import { useCourseApi } from '@contexts/ApiContext';

import { CourseRoute } from '@enums/Route';

import { useToast } from '@hooks/useToast';

import { Course } from '@models/Course';

import { NavigationServiceInstance } from '@services/index';

import { Props } from './types';

const tableStyle: CSSProperties = {
  tableLayout: 'fixed',
};

const Table: FC<Props> = ({
  courses = [],
  isFetched = false,
  loadinng = false,
  onRefresh,
}) => {
  const [selectedCourseToDelete, setSelectedCourseToDelete] =
    useState<Course>();
  const { remove } = useCourseApi();
  const { toast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const confirmDeleteModal = useRef<ModalConfirm>();

  const showDeleteModal = useCallback(
    (course: Course) => {
      setSelectedCourseToDelete(course);
      confirmDeleteModal.current.show();
    },
    [setSelectedCourseToDelete, confirmDeleteModal],
  );

  const onEdit = useCallback((code: string) => {
    const url = NavigationServiceInstance.parseRoute<Params>(CourseRoute.EDIT, {
      code,
    });

    Router.push(url);
  }, []);

  const onDelete = useCallback(async () => {
    setDeleteLoading(true);

    try {
      await remove(selectedCourseToDelete.codigo);

      toast({
        description: `Curso "${selectedCourseToDelete.codigo}" removido com sucesso`,
        duration: 5000,
        status: 'success',
        title: 'Sucesso',
      });

      onRefresh();
    } catch ({
      message = `Erro ao apagar o curso "${selectedCourseToDelete.codigo}", tente novamente mais tarde`,
    }) {
      toast({
        description: message,
        duration: 5000,
        status: 'error',
        title: 'Erro',
      });

      setDeleteLoading(false);
    } finally {
      confirmDeleteModal.current.hide();
    }
  }, [onRefresh, remove, selectedCourseToDelete, toast]);

  return (
    <Flex flexDir="column">
      <ModalConfirm
        loading={deleteLoading}
        onSuccess={onDelete}
        ref={confirmDeleteModal}
      >
        <Text>Deseja realmente apagar o curso?</Text>
        <br />

        <Box display="flex">
          <Text fontWeight="bold">Código:</Text>&nbsp;
          <Text>{selectedCourseToDelete?.codigo}</Text>
        </Box>

        <Box display="flex">
          <Text fontWeight="bold">Nome:</Text>&nbsp;
          <Text>{selectedCourseToDelete?.nome}</Text>
        </Box>

        <Box display="flex">
          <Text fontWeight="bold">Campus:</Text>&nbsp;
          <Text>{selectedCourseToDelete?.campus}</Text>
        </Box>
      </ModalConfirm>

      <TableContainer>
        <ChackraTable
          className="course-table"
          colorScheme="whiteAlpha"
          variant="striped"
          style={tableStyle}
        >
          <Thead>
            <Tr>
              <Th textAlign="center">Código</Th>
              <Th textAlign="center">Nome</Th>
              <Th textAlign="center">Unidade</Th>
              <Th textAlign="center">Campus</Th>
              <Th textAlign="center">Choque Período</Th>
              <Th textAlign="center">Choque Horário</Th>
              <Th textAlign="center">Ações</Th>
            </Tr>
          </Thead>

          <Tbody>
            {loadinng && <Loader columns={8} lines={3} />}

            {isFetched && !courses.length && (
              <Tr>
                <Td colSpan={8}>
                  <Text color="gray" textAlign="center" fontSize="20px">
                    Nenhum curso encontrado
                  </Text>
                </Td>
              </Tr>
            )}

            {courses.map(course => (
              <Tr key={`course-${course.codigo}`}>
                <Td textAlign="center">{course.codigo}</Td>
                <Td overflow="hidden" textOverflow="ellipsis">
                  <Tooltip label={course.nome}>{course.nome}</Tooltip>
                </Td>
                <Td textAlign="center">{course.unidade}</Td>
                <Td textAlign="center">{course.campus}</Td>

                <Td px="6" textAlign="center">
                  {course.permitir_choque_periodo ? (
                    <CheckIcon color="green" />
                  ) : (
                    <CloseIcon color="red" />
                  )}
                </Td>

                <Td px="6" textAlign="center">
                  {course.permitir_choque_horario ? (
                    <CheckIcon color="green" />
                  ) : (
                    <CloseIcon color="red" />
                  )}
                </Td>

                <Td textAlign="center">
                  <Button
                    as="a"
                    colorScheme="teal"
                    cursor="pointer"
                    fontSize="sm"
                    onClick={() => onEdit(course.codigo)}
                    mr="10px"
                    size="sm"
                    textAlign="center"
                  >
                    <Icon as={RiPencilLine} fontSize="16" />
                  </Button>

                  <Button
                    as="a"
                    colorScheme="red"
                    cursor="pointer"
                    fontSize="sm"
                    onClick={() => showDeleteModal(course)}
                    size="sm"
                    textAlign="center"
                  >
                    <Icon as={RiDeleteBin6Line} fontSize="16" />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ChackraTable>
      </TableContainer>
    </Flex>
  );
};

export { Table };
